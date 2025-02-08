// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// const Services = () => {
//   // Sample data for hospital services
//   const services = [
//     {
//       title: "Emergency Care",
//       description: "24/7 emergency services with state-of-the-art facilities.",
//       logo: "/path/to/emergency-logo.png",
//       image: "/path/to/emergency-image.jpg",
//     },
//     {
//       title: "Cardiology",
//       description: "Comprehensive heart care and advanced treatments.",
//       logo: "/path/to/cardiology-logo.png",
//       image: "/path/to/cardiology-image.jpg",
//     },
//     {
//       title: "Pediatrics",
//       description: "Specialized care for children of all ages.",
//       logo: "/path/to/pediatrics-logo.png",
//       image: "/path/to/pediatrics-image.jpg",
//     },
//     // Add more services as needed
//   ];

//   // Settings for the carousel
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//           infinite: true,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           initialSlide: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div
//       className="h-screen flex m-auto flex-col max-w-screen relative my-3 justify-center"
//       id="Services"
//     >
//       <h1 className="text-center font-serif text-4xl m-4 fade-in">Services</h1>
//       <Slider {...settings} className="p-5">
//         {services.map((service, index) => (
//           <div key={index} className="px-2">
//             <Card className="fade-in fade-out-5">
//               <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
//                 <img
//                   src={service.image}
//                   alt={service.title}
//                   className="w-32 h-32 rounded-full object-cover mb-4"
//                 />
//                 <CardTitle className="text-lg font-medium text-center">
//                   {service.title}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="text-center">
//                 <p className="text-sm text-gray-600">{service.description}</p>
//               </CardContent>
//             </Card>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default Services;
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      title: "Emergency Care",
      description: "24/7 emergency services with state-of-the-art facilities.",
    },
    {
      title: "Cardiology",
      description: "Comprehensive heart care and advanced treatments.",
    },
    {
      title: "Pediatrics",
      description: "Specialized care for children of all ages.",
    },
    // Add more services as needed
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div
      className="flex m-auto flex-col max-w-screen relative py-12 px-4 sm:px-6 lg:px-8"
      id="Services"
    >
      <h1 className="text-center font-serif text-4xl mb-8 fade-in">Services</h1>
      <Slider {...settings}>
        {services.map((service, index) => (
          <div key={index} className="px-2 focus:outline-none">
            <Card className="min-h-[300px] flex flex-col fade-in fade-out-5">
              <CardHeader className="flex-1 flex flex-col items-center justify-center pb-2">
                <CardTitle className="text-xl font-semibold text-center mb-4">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Services;
