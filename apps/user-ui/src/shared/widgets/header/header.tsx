import ProfileIcon from '@/assets/svgs/profile-icon';
import { HeartIcon, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import HeaderBottom from './header-bottom';

const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="m-auto flex w-[80%] items-center justify-between py-5">
        <div>
          <Link href={'/'}>
            <span className="text-2xl font-[500]">Eshop</span>
          </Link>
        </div>
        <div className="relative w-[50%]">
          <input
            type="text"
            placeholder="Search for products..."
            className="font-Poppins h-[55px] w-full rounded-md border-[2.5px] border-[#3489ff] px-4 font-medium outline-none"
          />
          <div className="absolute right-0 top-0 flex h-[55px] w-[60px] cursor-pointer items-center justify-center rounded-md bg-[#3489ff]">
            <Search color="#fff" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link
              href={'/login'}
              className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full border-2 border-[#010f1c1a]"
            >
              <ProfileIcon size={28} color="#000" />
            </Link>

            <Link href={'/login'}>
              <span className="block font-medium">Hello,</span>
              <span className="font-semibold">Sign In</span>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link href={'/wishlist'} className="relative">
              <HeartIcon />
              <div className="absolute right-[-10px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500">
                <span className="text-sm font-medium text-white">0</span>
              </div>
            </Link>
            <Link href={'/cart'} className="relative">
              <ShoppingBag />
              <div className="absolute right-[-10px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500">
                <span className="text-sm font-medium text-white">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-b-[#99999938]" />
      <HeaderBottom />
    </div>
  );
};

export default Header;
