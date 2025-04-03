"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          About <span className="text-blue-500">FundChain</span>
        </h1>

        <div className="max-w-4xl mx-auto space-y-12">
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-300 mb-4">
                FundChain is revolutionizing crowdfunding through blockchain
                technology, creating a transparent, secure, and decentralized
                platform where every transaction is verifiable and immutable.
              </p>
              <p className="text-gray-300">
                We believe in empowering creators, charities, and communities by
                removing traditional barriers and middlemen, ensuring that more
                funds reach those who need them most.
              </p>
            </div>
            <div className="order-first md:order-last">
              <div className="bg-blue-900/30 rounded-lg p-6 flex items-center justify-center">
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 bg-blue-500 rounded-full opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🔗</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">
              How FundChain Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">1</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Create or Support</h3>
                <p className="text-gray-400">
                  Create your own fundraiser or browse existing projects to
                  support causes you care about.
                </p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">2</span>
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Secure Transactions
                </h3>
                <p className="text-gray-400">
                  All donations are processed through smart contracts, ensuring
                  security and transparency.
                </p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">3</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Track Impact</h3>
                <p className="text-gray-400">
                  Follow your contributions in real-time and see the direct
                  impact of your support.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-bold mb-6">Our Team</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              FundChain is built by a passionate team of blockchain enthusiasts,
              developers, and social impact advocates committed to creating
              positive change through technology.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "CEO & Founder",
                "CTO",
                "Head of Operations",
                "Community Lead",
              ].map((role, i) => (
                <div key={i} className="text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-medium">Team Member</h3>
                  <p className="text-sm text-gray-400">{role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
