'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { label: 'Prize Pool', value: '1+ million', endValue: 1000000 },
    { label: 'Events', value: '50+', endValue: 50 },
    { label: 'Event Categories', value: '6', endValue: 6 },
    { label: 'Social Events', value: '10', endValue: 10 },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    if (!inView) return;

    const intervals = stats.map((stat, index) => {
      const duration = 1800;
      const framesPerSecond = 30;
      const totalFrames = (duration / 1000) * framesPerSecond;
      const increment = stat.endValue / totalFrames;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.endValue) {
          current = stat.endValue;
          clearInterval(interval);
        }

        setCounters((prev) => {
          const updated = [...prev];
          updated[index] = Math.floor(current);
          return updated;
        });
      }, 1000 / framesPerSecond);

      return interval;
    });

    return () => intervals.forEach(clearInterval);
  }, [inView]);

  const formatValue = (index, value) => {
    if (index === 0) return value.toLocaleString() + '+';
    if (index === 1) return value + '+';
    return value.toString();
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#301C5F] sm:text-4xl relative inline-block">
            What do We Offer?
            <motion.span 
              className="absolute -bottom-2 left-0 w-full h-1 bg-[#F3E52F]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            ></motion.span>
          </h2>
          <p className="mt-6 text-lg leading-7 text-gray-600">
            Elevating competitions with premier solutions and exclusive opportunities
          </p>
        </motion.div>
      </div>
      
      <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto" ref={ref}>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative px-6 py-8 overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <dt className="text-base font-medium text-gray-500">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-4xl font-semibold tracking-tight text-[#301C5F]">
                  {formatValue(index, counters[index])}
                </dd>
                <div className="absolute top-0 left-0 w-1 h-full bg-[#301C5F]"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#301C5F] to-transparent"></div>
              </motion.div>
            ))}
          </dl>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Stats;