import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah Johnson',
    role: 'Digital Marketing Manager',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    review: 'FileShare has revolutionized how we share assets with our clients. Fast, secure, and reliable!',
    stars: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Software Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    review: 'Perfect for sharing large files with my team. The interface is clean and intuitive.',
    stars: 5,
  },
  {
    name: 'Emma Davis',
    role: 'Graphic Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    review: 'As a designer, I need to share large files daily. FileShare makes it effortless.',
    stars: 4,
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {review.name}
                  </h3>
                  <p className="text-sm text-gray-600">{review.role}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(review.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600">{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}