import Link from 'next/link';

const FooterSection = () => {
    return (
        <footer className="w-full border-t border-[#ececec] bg-[#f5fbfc] py-8 mt-auto">
            <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* All rights reserved */}
                <div className="text-sm text-[#7e828f] text-center md:text-left">
                    All rights reserved.
                </div>
                {/* Links */}
                <div className="flex space-x-6 text-sm">
                    <Link href="/about" className="hover:text-[#35b8be] transition">About</Link>
                    <Link href="/blog" className="hover:text-[#35b8be] transition">Blog</Link>
                    <Link href="/contact" className="hover:text-[#35b8be] transition">Contact Us</Link>
                    <Link href="/help" className="hover:text-[#35b8be] transition">Help</Link>
                </div>
            </div>
        </footer>
    );
}

export default FooterSection;