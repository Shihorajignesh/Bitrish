import React from "react";
import Restaurantsection from "../components/Reastaurantsection";

function Restaurant() {
  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-5">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold">
            🍽 Restaurants
          </h1>

          <p className="text-gray-500 mt-3">
            Find your favourite restaurant and order delicious food.
          </p>
        </div>

      <Restaurantsection />

      </div>
    </section>
  );
}

export default Restaurant;