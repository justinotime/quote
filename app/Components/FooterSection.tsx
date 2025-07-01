import Link from 'next/link';

const FooterSection = () => {
    return (
        <footer className="w-full border-t border-[#ececec] bg-white py-12 mt-auto">
            <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* All rights reserved */}
                <div className="text-sm text-[#7e828f] text-center md:text-left">
                    © 2024 Quote. All rights reserved.
                </div>
                {/* Links */}
                <div className="flex space-x-8 text-sm">
                    <Link href="/about" className="text-[#7e828f] hover:text-[#191b22] transition">About</Link>
                    <Link href="/blog" className="text-[#7e828f] hover:text-[#191b22] transition">Blog</Link>
                    <Link href="/careers" className="text-[#7e828f] hover:text-[#191b22] transition">Careers</Link>
                    <Link href="/contact" className="text-[#7e828f] hover:text-[#191b22] transition">Contact</Link>
                    <Link href="/help" className="text-[#7e828f] hover:text-[#191b22] transition">Help</Link>
                </div>
            </div>
        </footer>
    );
}

export default FooterSection;