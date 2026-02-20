"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="page">

        {/* HEADER */}
        <header className="header">

          <div className="logo">
            <Image
              src="/images/logo.png"
              alt="Splito Logo"
              width={36}
              height={36}
            />
            <span>Splito</span>
          </div>

          <div className="nav">
            <Link href="/authentication/signup" className="btn-outline">
              Sign Up
            </Link>

            <Link href="/authentication/login" className="btn-primary">
              Login
            </Link>
          </div>

        </header>


        {/* MAIN */}
        <main className="main">

          {/* LEFT */}
          <div className="left">

            <h1>
              Manage Group<br />
              Expenses the<br />
              Easy Way
            </h1>

            <p className="subtitle">
              Helps you to organize your Bills
            </p>


            {/* STATS CARD */}
            <div className="statsCard">

              <div className="statsHeader">

                <div>
                  <span className="label">LAST MONTH</span>

                  <div className="date">
                    <strong>28</strong>
                    <div>
                      Monday<br />
                      June 2021
                    </div>
                  </div>

                </div>


                <div className="thisMonth">

                  <span className="label">THIS MONTH</span>

                  <div className="amount">
                    +10,200
                  </div>

                </div>

              </div>


              <div className="category">

                <span>🚗 Transportation</span>
                <span>50,000</span>

              </div>


              <div className="category">

                <span>🍔 Food & Beverage</span>
                <span>35000</span>

              </div>

            </div>


          </div>



          {/* RIGHT */}
          <div className="right">

            <Image
              src="/images/landing-illustration.png"
              alt="illustration"
              width={420}
              height={420}
              className="illustration"
            />


            <Image
              src="/images/tyre.png"
              alt="tyre"
              width={260}
              height={260}
              className="tyre"
            />


            <div className="featureCard">

              <h3>Split bill the easy way</h3>

              <p>
                You can quickly log daily transactions within seconds and organize
                them into clean, visual categories like Expenses, Food, Shopping or Income.
                Salary, Gift, making group expense tracking simple and transparent.
              </p>

            </div>

          </div>

        </main>


      </div>



      {/* CSS INSIDE SAME FILE */}
      <style jsx>{`

        .page{
          min-height:100vh;
          background:#f5f6f8;
          padding:40px 80px;
          font-family: Inter, sans-serif;
        }


        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }


        .logo{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:20px;
          font-weight:600;
        }


        .nav{
          display:flex;
          gap:20px;
        }


        .btn-primary{
          background:#22c55e;
          color:white;
          padding:10px 26px;
          border-radius:6px;
          text-decoration:none;
          font-weight:500;
        }


        .btn-outline{
          background:#22c55e;
          color:white;
          padding:10px 26px;
          border-radius:6px;
          text-decoration:none;
        }


        .main{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:60px;
        }


        .left{
          max-width:520px;
        }


        h1{
          font-size:64px;
          font-weight:800;
          line-height:1.1;
          color:#2d2d2d;
        }


        .subtitle{
          margin-top:10px;
          color:#9ca3af;
        }



        .statsCard{
          margin-top:40px;
          background:white;
          padding:24px;
          border-radius:12px;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);
          width:360px;
        }


        .statsHeader{
          display:flex;
          justify-content:space-between;
        }


        .label{
          font-size:12px;
          color:#9ca3af;
        }


        .date{
          display:flex;
          gap:10px;
          margin-top:10px;
        }


        .date strong{
          font-size:22px;
        }


        .thisMonth{
          text-align:right;
        }


        .amount{
          margin-top:12px;
          font-weight:600;
        }


        .category{
          margin-top:14px;
          display:flex;
          justify-content:space-between;
        }



        .right{
          position:relative;
        }


        .illustration{
          z-index:2;
          position:relative;
        }


        .tyre{
          position:absolute;
          left:-100px;
          bottom:-40px;
        }


        .featureCard{
          position:absolute;
          bottom:-20px;
          right:-60px;
          background:#2f3e46;
          color:white;
          padding:24px;
          width:320px;
          border-radius:6px;
        }


        .featureCard h3{
          font-size:22px;
          margin-bottom:8px;
        }


        .featureCard p{
          font-size:14px;
          color:#d1d5db;
        }


      `}</style>

    </>
  );
}