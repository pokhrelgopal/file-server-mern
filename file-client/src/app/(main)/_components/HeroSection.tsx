"use client";

import React from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "iconsax-react";
import Button from "@/app/components/ui/button";

export default function HeroSection({ user }: { user: any }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const dotsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1,
        duration: 0.5,
      },
    },
  };

  return (
    <article className="min-h-screen my-auto bg-gradient-to-r from-zinc-900 to-blue-800">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 py-6">
        <h4 className="text-h4 text-red-600">DropIT</h4>
        <div>
          <Link href="/login">
            <Button variant={"secondary"}>Sign In</Button>
          </Link>
        </div>
      </nav>
      <motion.main
        className="container mx-auto px-4 pt-40 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-7xl font-bold text-white mb-6 flex flex-col"
          variants={itemVariants}
        >
          <span>Easy and better file uploads for</span>
          <span className="pt-2 text-red-600">Web Developers</span>
        </motion.h1>
        <motion.p
          className="text-white text-xl mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Upload your files with ease, share them with your friends, and manage
          them with a few clicks.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link href="/">
            <button className="mx-auto flex items-center gap-2 text-xl bg-white text-red-600 font-semibold h-14 px-16 rounded-full hover:bg-gray-100 transition duration-300">
              <span>Get Started</span>
              <ArrowRight className="size-4 stroke-red-600" />
            </button>
          </Link>
        </motion.div>
      </motion.main>
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        variants={dotsVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-6 gap-2">
          {[...Array(36)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-white rounded-full opacity-50"
            ></div>
          ))}
        </div>
      </motion.div>
    </article>
  );
}
