import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                            <span>🔐</span>
                            <span>CRG @ SBU</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            The Cryptography Reading Group at Stony Brook University explores the frontiers of cryptographic research through weekly discussions and presentations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/talks" className="hover:text-primary-400 transition-colors">
                                    Talks Archive
                                </Link>
                            </li>
                            <li>
                                <Link href="/people" className="hover:text-primary-400 transition-colors">
                                    People
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <address className="not-italic text-gray-400 space-y-2">
                            <p><a href="https://www.stonybrook.edu/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Stony Brook University</a></p>
                            <p><a href="https://www.cs.stonybrook.edu/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Computer Science Department</a></p>
                            <a href="mailto:pmparekh@cs.stonybrook.edu" className="block hover:text-white transition-colors">
                                pmparekh@cs.stonybrook.edu
                            </a>
                        </address>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Cryptography Reading Group, Stony Brook University. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
