import Link from 'next/link';
import { prisma } from '@/lib/db';

export const revalidate = 0;


export default async function HomePage() {
  let nextTalk = await prisma.talk.findFirst({
    where: {
      date: { gte: new Date() },
    },
    orderBy: { date: 'asc' },
  });

  // If no upcoming talk, show the most recent past talk
  if (!nextTalk) {
    nextTalk = await prisma.talk.findFirst({
      where: { date: { lt: new Date() } },
      orderBy: { date: 'desc' },
    });
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-crypto-theme text-white py-20">
        <div className="section-container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
            Cryptography Reading Group
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Exploring the frontiers of cryptographic research at Stony Brook University
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/talks" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              View Upcoming Talks
            </Link>
            {/* <Link href="/contact" className="btn-secondary bg-transparent border-white text-white hover:bg-white/10 hover:text-white">
              Join Our Mailing List
            </Link> */}
          </div>
        </div>
      </section>

      {/* Next Meeting Section */}
      <section className="section-container">
        <div className="card-glass max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 rounded-lg p-4 text-center min-w-[80px]">
              {nextTalk ? (
                <>
                  <div className="text-3xl font-bold">{new Date(nextTalk.date).getDate()}</div>
                  <div className="text-sm">{new Date(nextTalk.date).toLocaleString('default', { month: 'short' })}</div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold">TBA</div>
                  <div className="text-sm">Next Talk</div>
                </>
              )}
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {nextTalk ? nextTalk.title : "Next Meeting Coming Soon"}
              </h2>
              {nextTalk ? (
                <div className="mb-4">
                  <p className="text-lg font-semibold text-primary-700">{nextTalk.speaker} {nextTalk.speakerAffiliation && `(${nextTalk.speakerAffiliation})`}</p>
                  <p className="text-gray-600 mt-2 line-clamp-2">{nextTalk.abstract}</p>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">
                  We meet weekly to discuss cutting-edge research papers in cryptography.
                  Check back soon for our next scheduled talk!
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{nextTalk ? nextTalk.time : "Weekly Meetings"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{nextTalk ? nextTalk.location : "Stony Brook University"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white pt-8 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About Our Reading Group
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              The Cryptography Reading Group at Stony Brook University brings together PhD students,
              researchers, and faculty to explore the latest developments in cryptographic research.
              We meet weekly to discuss seminal papers, recent breakthroughs, and open problems in
              areas including zero-knowledge proofs, AI Safety, secure multi-party computation, post-quantum
              cryptography, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="card">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Research Papers</h3>
                <p className="text-gray-600">
                  Dive deep into cutting-edge cryptography research
                </p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">Collaborative</h3>
                <p className="text-gray-600">
                  Engage in discussions with peers and experts
                </p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold mb-2">Advanced Cryptography</h3>
                <p className="text-gray-600">
                  Advanced topics for graduate students and researchers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="bg-primary-900 text-white py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Stay updated on upcoming talks and cryptography research
          </p>
          <Link href="/contact" className="btn-primary bg-white text-primary-900 hover:bg-gray-100 border-none">
            Subscribe to Mailing List
          </Link>
        </div>
      </section> */}
    </div>
  );
}
