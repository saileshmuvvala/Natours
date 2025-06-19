/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    if (!window.Stripe) {
      throw new Error('Stripe.js failed to load');
    }

    const stripe = window.Stripe(
      'pk_test_51Rac2rPrxB9qDRLJxtqYsoqZmTopajLi9yq5nZv1JhwzL2rsplM89NEOVZatzjqy2jkUDLrqx4lLv3Q9A8bkqnqV007oux64fr',
    );

    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2) Create checkout from + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error('Stripe booking error:', err);
    showAlert('error', err.message);
  }
};
