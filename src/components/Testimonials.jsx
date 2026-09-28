import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id:1,
    name:"Rahul Patel",
    role:"Food Lover",
    image:"https://randomuser.me/api/portraits/men/32.jpg",
    review:"Amazing food quality and super fast delivery. The pizza taste was next level ",
    rating:5,
  },
  {
    id:2,
    name:"Priya Sharma",
    role:"Regular Customer",
    image:"https://randomuser.me/api/portraits/women/44.jpg",
    review:"Best food delivery experience. App design is smooth and ordering is very easy ",
    rating:5,
  },
  {
    id:3,
    name:"Jay Mehta",
    role:"Food Blogger",
    image:"https://randomuser.me/api/portraits/men/75.jpg",
    review:"Restaurant collection is amazing. I found many hidden food gems here ",
    rating:4,
  },
];


function Testimonials(){

return(

<section className="relative py-20 bg-linear-to-b from-black via-gray-900 to-black overflow-hidden">

<div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"></div>

<div className="absolute bottom-10 right-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"></div>


<div className="max-w-7xl mx-auto px-6">


<motion.div 
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
transition={{duration:0.7}}
className="text-center mb-14"
>

<h2 className="text-4xl md:text-5xl font-extrabold text-white">
What Our <span className="text-orange-500">Customers</span> Say
</h2>

<p className="text-gray-400 mt-4 max-w-xl mx-auto">
Thousands of food lovers trust us for delicious meals and lightning fast delivery.
</p>

</motion.div>



<div className="grid grid-cols-1 md:grid-cols-3 gap-8">


{
reviews.map((item,index)=>(


<motion.div
key={item.id}
initial={{opacity:0,y:60}}
whileInView={{opacity:1,y:0}}
transition={{delay:index*0.2}}
whileHover={{y:-15,rotateX:5,rotateY:-5}}
className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-orange-500/30 transition duration-500"
>


<Quote className="absolute top-6 right-6 text-orange-500/40 w-12 h-12"/>


<div className="flex items-center gap-4">

<img src={item.image} alt={item.name} className="w-16 h-16 rounded-full border-2 border-orange-500"/>


<div>

<h3 className="text-white font-bold text-lg">
{item.name}
</h3>

<p className="text-gray-400 text-sm">
{item.role}
</p>

</div>

</div>


<p className="text-gray-300 mt-6 leading-relaxed">
"{item.review}"
</p>


<div className="flex mt-10 gap-1">

{
[...Array(item.rating)].map((_,i)=>(

<Star 
key={i}
size={20}
className="fill-yellow-800 text-yellow-100"
/>

))
}

</div>


</motion.div>


))
}


</div>


</div>

</section>

)

}


export default Testimonials;