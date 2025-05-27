import axios from "axios";

function App() {
  const paymentHandler = async () => {
    const res = await axios.post("http://localhost:3000/order", {
      amount: 100,
    });

    console.log(res.data);

    var options = {
      key: "rzp_test_xZFTCYoxu4isRv", // Enter the Key ID generated from the Dashboard
      amount: res.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: res.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {

        // BACKEND API CALL 
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);

        const res = await axios.post("http://localhost:3000/verify-payment",{
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id:response.razorpay_order_id,
          razorpay_signature:response.razorpay_signature
        })

        console.log(res)
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
 
    rzp1.open();
    
  };

  return (
    <>
      <button onClick={paymentHandler}>Pay Now</button>
    </>
  );
}

export default App;
