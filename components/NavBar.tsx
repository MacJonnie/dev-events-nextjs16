import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
    return(
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src="/icons/logo.png" alt="Logo" width={24} height={24} className="h-8 w-auto"/>
                </Link>

                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/">Events</Link>
                    <Link href="/">Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}

export default NavBar