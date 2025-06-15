"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

export default function BecomeAnArtistPage() {
  const { openArtistSignup } = useAuthModal();

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-[40vh] sm:h-[50vh] w-full mb-8">
            <div className="absolute inset-0 bg-sage-700 bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white max-w-3xl px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-2 sm:mb-4">
                  Join Our Artist Community
                </h1>
                <p className="text-xl">
                  Share your craft with the world and preserve cultural heritage
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 sm:mb-6">
              Become a Aadivaa Earth Artist
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              At Aadivaa Earth, we connect indigenous and traditional artisans
              with a global audience who values authentic, handcrafted items.
              Our platform provides you with the tools, resources, and exposure
              to share your craft while earning a sustainable income.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#application-process"
                className="px-6 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
              >
                Start Application
              </Link>
              <Link
                href="#faq"
                className="px-6 py-3 border border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16 bg-stone-50 py-16 rounded-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-8 sm:mb-12 text-center">
              Why Join Aadivaa Earth?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-3">
                  Fair Compensation
                </h3>
                <p className="text-stone-600">
                  Earn 70-80% of the selling price for your items, significantly
                  higher than traditional retail channels. Get paid reliably
                  with multiple payout options.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-3">
                  Global Reach
                </h3>
                <p className="text-stone-600">
                  Connect with customers worldwide who value authentic
                  handcrafted items. Our marketing team promotes your work to an
                  international audience.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-3">
                  Creative Freedom
                </h3>
                <p className="text-stone-600">
                  Maintain creative control over your work while receiving
                  guidance on market trends. We respect and promote the cultural
                  significance of your craft.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
              <div className="bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-3">
                  Business Support
                </h3>
                <p className="text-stone-600">
                  We handle photography, marketing, customer service, shipping,
                  and returns so you can focus on creating. Access training on
                  pricing, product descriptions, and market trends.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-3">
                  Artist Community
                </h3>
                <p className="text-stone-600">
                  Join a supportive community of like-minded artisans.
                  Participate in virtual workshops, collaborative projects, and
                  cultural exchange programs with other indigenous artists.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section id="application-process" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-8 sm:mb-12 text-center">
            Application Process
          </h2>

          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-stone-200 z-0"></div>

              {/* Steps */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-start">
                  <div className="flex-none md:w-1/2 md:pr-8 md:text-right order-2 md:order-1 mt-6 md:mt-0 pl-10 md:pl-0">
                    <h3 className="text-xl font-medium text-stone-900 mb-2">
                      Submit Initial Application
                    </h3>
                    <p className="text-stone-600 mb-4">
                      Fill out our online application form with your contact
                      information, craft specialization, and background. Include
                      photos of your work and a brief artist statement.
                    </p>
                    <button
                      onClick={() => {
                        openArtistSignup();
                      }}
                      className="inline-flex items-center cursor-pointer text-terracotta-600 hover:text-terracotta-700"
                    >
                      Start Application <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-terracotta-600 text-white z-10 order-1 md:order-2">
                    1
                  </div>
                  <div className="flex-none md:w-1/2 md:pl-8 order-3 mt-6 md:mt-0 pl-10">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h4 className="font-medium text-stone-900 mb-2">
                        Requirements:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>5+ high-quality photos of your work</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Brief description of your craft tradition</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Contact information</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-start">
                  <div className="flex-none md:w-1/2 md:pr-8 md:text-right order-2 md:order-1 mt-6 md:mt-0 pl-10 md:pl-0">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h4 className="font-medium text-stone-900 mb-2">
                        What We Look For:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Authentic cultural craftsmanship</span>
                        </li>
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Quality of workmanship</span>
                        </li>
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Uniqueness and market potential</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-terracotta-600 text-white z-10 order-1 md:order-2">
                    2
                  </div>
                  <div className="flex-none md:w-1/2 md:pl-8 order-3 mt-6 md:mt-0 pl-10">
                    <h3 className="text-xl font-medium text-stone-900 mb-2">
                      Initial Review
                    </h3>
                    <p className="text-stone-600 mb-4">
                      Our curation team will review your application within 5-7
                      business days. We evaluate the cultural authenticity,
                      craftsmanship quality, and market potential of your work.
                    </p>
                    <p className="text-stone-600">
                      You'll receive an email notification once your application
                      has been reviewed.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-start">
                  <div className="flex-none md:w-1/2 md:pr-8 md:text-right order-2 md:order-1 mt-6 md:mt-0 pl-10 md:pl-0">
                    <h3 className="text-xl font-medium text-stone-900 mb-2">
                      Virtual Interview
                    </h3>
                    <p className="text-stone-600 mb-4">
                      If your initial application is approved, we'll schedule a
                      30-minute video call to learn more about your craft,
                      process, and story. This helps us understand how to best
                      represent your work.
                    </p>
                    <p className="text-stone-600">
                      We'll work with your schedule and can provide technical
                      assistance if needed.
                    </p>
                  </div>
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-terracotta-600 text-white z-10 order-1 md:order-2">
                    3
                  </div>
                  <div className="flex-none md:w-1/2 order-3 mt-6 md:mt-0 pl-10 md:pl-8">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h4 className="font-medium text-stone-900 mb-2">
                        Interview Topics:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Your craft tradition and techniques</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cultural significance of your work</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Production capacity and timeline</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Your goals as an artisan</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex flex-col md:flex-row items-start">
                  <div className="flex-none md:w-1/2 md:pr-8 md:text-right order-2 md:order-1 mt-6 md:mt-0 pl-10 md:pl-0">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h4 className="font-medium text-stone-900 mb-2">
                        Sample Requirements:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>2-3 representative pieces</span>
                        </li>
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>We cover shipping costs</span>
                        </li>
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Samples returned after review</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-terracotta-600 text-white z-10 order-1 md:order-2">
                    4
                  </div>
                  <div className="flex-none md:w-1/2 order-3 mt-6 md:mt-0 pl-10 md:pl-8">
                    <h3 className="text-xl font-medium text-stone-900 mb-2">
                      Sample Submission
                    </h3>
                    <p className="text-stone-600 mb-4">
                      After a successful interview, we'll request sample pieces
                      to evaluate quality, craftsmanship, and presentation. We
                      cover all shipping costs and will return your samples
                      after review.
                    </p>
                    <p className="text-stone-600">
                      This step helps us understand your work in person and plan
                      for professional photography.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex flex-col md:flex-row items-start">
                  <div className="flex-none md:w-1/2 md:pr-8 md:text-right order-2 md:order-1 mt-6 md:mt-0 pl-10 md:pl-0">
                    <h3 className="text-xl font-medium text-stone-900 mb-2">
                      Onboarding
                    </h3>
                    <p className="text-stone-600 mb-4">
                      Congratulations! If your samples are approved, we'll send
                      you our artist agreement and begin the onboarding process.
                      This includes setting up your artist profile, payment
                      details, and product listings.
                    </p>
                  </div>
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-terracotta-600 text-white z-10 order-1 md:order-2">
                    5
                  </div>
                  <div className="flex-none md:w-1/2 order-3 mt-6 md:mt-0 pl-10 md:pl-8">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h4 className="font-medium text-stone-900 mb-2">
                        Onboarding Includes:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Artist profile creation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Product listing assistance</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Professional photography</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Payment setup</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Training on our platform</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative flex flex-col md:flex-row items-start">
                  <div className="flex-none md:w-1/2 md:pr-8 md:text-right order-2 md:order-1 mt-6 md:mt-0 pl-10 md:pl-0">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h4 className="font-medium text-stone-900 mb-2">
                        Launch Support:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Featured in "New Artists" collection</span>
                        </li>
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Social media promotion</span>
                        </li>
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Journal feature article</span>
                        </li>
                        <li className="flex items-start md:flex-row-reverse">
                          <CheckCircle className="w-5 h-5 text-terracotta-600 md:ml-2 mr-2 md:mr-0 flex-shrink-0 mt-0.5" />
                          <span>Email newsletter introduction</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-terracotta-600 text-white z-10 order-1 md:order-2">
                    6
                  </div>
                  <div className="flex-none md:w-1/2 order-3 mt-6 md:mt-0 pl-10 md:pl-8">
                    <h3 className="text-xl font-medium text-stone-900 mb-2">
                      Launch Your Shop
                    </h3>
                    <p className="text-stone-600 mb-4">
                      Once your profile and initial products are set up, we'll
                      launch your artist shop on Aadivaa Earth. Your work will
                      be featured in our "New Artists" collection and promoted
                      across our marketing channels.
                    </p>
                    <p className="text-stone-600">
                      Our team will provide ongoing support to help you succeed
                      on our platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <div className="bg-stone-50 p-8 sm:p-12 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-8 sm:mb-12 text-center">
              Artist Requirements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-medium text-stone-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2" />
                  Eligibility
                </h3>
                <ul className="space-y-3 text-stone-600 pl-7">
                  <li className="list-disc">
                    Indigenous or traditional artisan with cultural connection
                    to your craft
                  </li>
                  <li className="list-disc">
                    Minimum 2 years of experience in your craft
                  </li>
                  <li className="list-disc">
                    Ability to produce at least 10-15 items per month
                  </li>
                  <li className="list-disc">
                    Access to reliable internet connection (mobile is
                    acceptable)
                  </li>
                  <li className="list-disc">
                    Valid ID and ability to receive electronic payments
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-stone-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2" />
                  Product Standards
                </h3>
                <ul className="space-y-3 text-stone-600 pl-7">
                  <li className="list-disc">
                    Handcrafted items with cultural significance
                  </li>
                  <li className="list-disc">
                    High-quality craftsmanship and materials
                  </li>
                  <li className="list-disc">
                    Authentic representation of cultural traditions
                  </li>
                  <li className="list-disc">
                    Sustainable and ethically sourced materials when possible
                  </li>
                  <li className="list-disc">
                    Items that can be safely shipped internationally
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-stone-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2" />
                  Documentation
                </h3>
                <ul className="space-y-3 text-stone-600 pl-7">
                  <li className="list-disc">Valid government-issued ID</li>
                  <li className="list-disc">
                    Proof of cultural affiliation (if applicable)
                  </li>
                  <li className="list-disc">
                    Portfolio of previous work (digital photos)
                  </li>
                  <li className="list-disc">
                    Artist statement and craft description
                  </li>
                  <li className="list-disc">
                    Banking information for payments
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-stone-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-terracotta-600 mr-2" />
                  Commitment
                </h3>
                <ul className="space-y-3 text-stone-600 pl-7">
                  <li className="list-disc">
                    Timely production and shipping of orders
                  </li>
                  <li className="list-disc">
                    Regular communication with our team
                  </li>
                  <li className="list-disc">
                    Participation in quality control process
                  </li>
                  <li className="list-disc">
                    Willingness to share your craft's story and cultural context
                  </li>
                  <li className="list-disc">
                    Adherence to our ethical and fair trade standards
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-8 sm:mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6 px-4">
            {[
              {
                question: "How long does the application process take?",
                answer:
                  "The entire process typically takes 4-6 weeks from initial application to shop launch. Initial review takes 5-7 business days, followed by the interview, sample submission, and onboarding phases.",
              },
              {
                question: "What percentage of sales do I receive?",
                answer:
                  "Artists receive 70-80% of the final selling price, depending on the product category and shipping requirements. This is significantly higher than traditional retail channels, which typically offer 30-50%.",
              },
              {
                question: "How are my products shipped to customers?",
                answer:
                  "You have two options: ship items directly to customers using our prepaid shipping labels, or send inventory to our fulfillment center where we handle storage and shipping. We'll discuss which option works best for your situation during onboarding.",
              },
              {
                question: "How often will I get paid?",
                answer:
                  "We process payments twice monthly. You can choose to receive payments via direct deposit, PayPal, or other methods depending on your location. There is a 14-day holding period for new orders to allow for potential returns.",
              },
              {
                question:
                  "What if I can only produce a limited quantity of items?",
                answer:
                  "We work with artists at various production capacities. If you create limited-edition or one-of-a-kind pieces, we can structure your shop accordingly and set appropriate customer expectations.",
              },
              {
                question: "Do I need to speak English fluently?",
                answer:
                  "While basic English communication is helpful, it's not a requirement. We have translators available for several indigenous languages and can work with local liaisons if needed to ensure clear communication.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-stone-200 pb-6">
                <h3 className="text-lg font-medium text-stone-900 mb-2 flex items-start">
                  <HelpCircle className="w-5 h-5 text-terracotta-600 mr-2 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-stone-600 pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-stone-600 mb-4">
              Don't see your question answered here?
            </p>
            <Link
              href="/About"
              className="inline-flex items-center px-6 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
            >
              Contact Our Artist Support Team
            </Link>
          </div>
        </section>

        {/* Application CTA */}
        <section className="bg-stone-900 text-white p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-3xl font-light mb-4">
            Ready to Share Your Craft with the World?
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join our community of indigenous and traditional artisans and bring
            your unique cultural heritage to a global audience that values
            authentic craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                openArtistSignup();
              }}
              className="px-8 cursor-pointer py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
            >
              Start Your Application
            </button>
            <Link
              href="/About"
              className="px-8 py-3 border border-white text-white font-medium hover:bg-stone-800 transition-colors"
            >
              Contact Artist Support
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
