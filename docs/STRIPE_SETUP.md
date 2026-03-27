/**
 * Stripe Setup Guide
 */

# Stripe Integration Setup

Complete guide to setting up Stripe payment processing.

## Prerequisites

- Stripe account
- Production and test keys
- Webhooks configured
- SSL certificate (production)

## Getting Stripe Keys

1. Log in to Stripe Dashboard
2. Go to Developers → API Keys
3. Copy:
   - **Publishable Key** (pk_test_xxx / pk_live_xxx)
   - **Secret Key** (sk_test_xxx / sk_live_xxx)

## Environment Configuration

Add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_50NjIxODAxOTk0MjAwMA
STRIPE_SECRET_KEY=sk_test_4eC39HqLyjWDarhtT
STRIPE_WEBHOOK_SECRET=whsec_test_123456789
```

## Create Products in Stripe

### Dashboard Setup

1. Go to **Products** → **Add Product**
2. Create products for each plan:

**Starter Plan**
- Name: "100 Credits"
- Price: $9.00
- ID: `price_starter`

**Growth Plan**
- Name: "500 Credits"
- Price: $39.00
- ID: `price_growth`

**Pro Plan**
- Name: "1500 Credits"
- Price: $99.00
- ID: `price_pro`

## Payment Implementation

### Setup in Backend

```python
import stripe

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

def create_checkout_session(user_id: str, plan: str):
    prices = {
        'starter': 'price_starter',
        'growth': 'price_growth',
        'pro': 'price_pro'
    }
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': prices[plan],
            'quantity': 1
        }],
        mode='payment',
        success_url='https://yourdomain.com/en/wallet?success=true',
        cancel_url='https://yourdomain.com/en/wallet?canceled=true',
        client_reference_id=user_id
    )
    
    return session.id
```

### Frontend Usage

```typescript
// See components/studio/ToolCard.tsx for frontend integration
import { createCheckoutSession } from '@/lib/stripe/client';

const handlePurchase = async (plan: string) => {
  try {
    await createCheckoutSession(plan);
  } catch (error) {
    console.error('Checkout error:', error);
  }
};
```

## Webhooks

### Create Webhook Endpoint

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`

### Handle Webhooks

```python
@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, 
            os.environ.get('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError:
        raise HTTPException(status_code=400)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400)
    
    # Handle event
    if event['type'] == 'payment_intent.succeeded':
        handle_payment_success(event['data']['object'])
    
    return {"status": "success"}
```

## Testing

### Test Card Numbers

**Visa**
- Number: 4242 4242 4242 4242
- Expiry: 12/25
- CVC: 123

**Mastercard**
- Number: 5555 5555 5555 4444
- Expiry: 12/25
- CVC: 123

**Amex**
- Number: 378282246310005
- Expiry: 12/25
- CVC: 1234

### Test Webhooks

```bash
# Using Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

## Production Setup

1. Switch to Live Keys in Stripe Dashboard
2. Update environment variables with live keys
3. Test payment flow end-to-end
4. Enable production mode
5. Configure SSL certificate
6. Update redirect URLs to production domain

## Troubleshooting

### Webhook Not Triggering

- Verify endpoint URL is public
- Check webhook signing secret
- Review Stripe logs for errors

### Payment Not Processing

- Verify API keys are correct
- Check product IDs match
- Review Stripe logs
- Test with test card first

### Session Creation Fails

- Confirm publishable key is set
- Verify product IDs exist
- Check CORS configuration
- Review browser console for errors

## Compliance

### PCI DSS

- Never handle raw card data
- Use Stripe's hosted checkout
- Maintain secure API keys
- Regular security updates

### SCA/3D Secure

Enable for EU/UK:
```python
session = stripe.checkout.Session.create(
    payment_method_types=['card'],
    line_items=[...],
    mode='payment'
    # SCA automatically handled by Stripe
)
```

## Support

- Stripe Docs: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Support Dashboard: https://dashboard.stripe.com/support
