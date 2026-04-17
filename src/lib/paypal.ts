// Helpers pour l'API REST PayPal (côté serveur uniquement)
//
// Doc : https://developer.paypal.com/docs/api/orders/v2/
//
// Variables d'env requises :
//   - PAYPAL_ENV (sandbox | live)
//   - PAYPAL_CLIENT_ID
//   - PAYPAL_CLIENT_SECRET

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/** Récupère un access token OAuth2 PayPal */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID ou PAYPAL_CLIENT_SECRET manquant");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PayPal auth failed: ${txt}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/** Crée un ordre PayPal pour un paiement unique en EUR */
export async function createPayPalOrder(params: {
  amount: number; // Montant en euros, ex : 150
  description: string;
  bookingId: string;
}): Promise<{ id: string; approveUrl: string | null }> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.bookingId,
          description: params.description,
          amount: {
            currency_code: "EUR",
            value: params.amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Atlas Fitness",
        locale: "fr-FR",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PayPal create order failed: ${txt}`);
  }

  const data = (await res.json()) as {
    id: string;
    links?: { rel: string; href: string }[];
  };

  const approveUrl =
    data.links?.find((l) => l.rel === "approve")?.href ?? null;

  return { id: data.id, approveUrl };
}

/** Capture un ordre PayPal après approbation par l'utilisateur */
export async function capturePayPalOrder(orderId: string): Promise<{
  status: string;
  amount: string;
  currency: string;
  payerEmail?: string;
  payerName?: string;
  bookingId?: string;
}> {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PayPal capture failed: ${txt}`);
  }

  const data = (await res.json()) as {
    status: string;
    purchase_units?: Array<{
      reference_id?: string;
      payments?: {
        captures?: Array<{
          amount: { value: string; currency_code: string };
        }>;
      };
    }>;
    payer?: {
      email_address?: string;
      name?: { given_name?: string; surname?: string };
    };
  };

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const name = data.payer?.name;

  return {
    status: data.status,
    amount: capture?.amount?.value ?? "0",
    currency: capture?.amount?.currency_code ?? "EUR",
    payerEmail: data.payer?.email_address,
    payerName: name
      ? `${name.given_name ?? ""} ${name.surname ?? ""}`.trim()
      : undefined,
    bookingId: data.purchase_units?.[0]?.reference_id,
  };
}

/** Vérifie si les clés PayPal sont configurées (pas encore les placeholders) */
export function isPayPalConfigured(): boolean {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  return (
    !!id &&
    !!secret &&
    !id.includes("VOTRE_CLIENT_ID") &&
    !secret.includes("VOTRE_CLIENT_SECRET")
  );
}
