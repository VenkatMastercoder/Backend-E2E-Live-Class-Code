// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Nyli1SEU6LPGcfbjr3TYbsFnnkQvKMRzKHyWcsrN8qStlRpmXrZ8xoU5V4z4sZuQqGu5nz23niQLWcuwIJeBSgM00798yvLh5');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1Q9LGhSEU6LPGcfbwyPs3qA6',
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Running on port 4242'));