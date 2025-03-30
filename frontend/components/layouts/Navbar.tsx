'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Search } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className='sticky top-0 z-50 w-full border-b border-blue-900/20 bg-black/80 backdrop-blur-sm'>
      <div className='container flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-4'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='text-xl font-bold'>
              <span className='text-white'>FUND</span>
              <span className='text-blue-500'>CHAIN</span>
            </span>
          </Link>

          <div className='relative ml-4 hidden md:block'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search'
              className='h-9 rounded-md bg-gray-800 pl-10 pr-4 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='ml-2'>
                Fund <span className='ml-1'>▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='start'
              className='w-48 bg-gray-900 text-white'
            >
              <DropdownMenuItem>Create Fundraiser</DropdownMenuItem>
              <DropdownMenuItem>Browse Projects</DropdownMenuItem>
              <DropdownMenuItem>My Donations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='flex items-center gap-4'>
          <Link
            href='/about'
            className='hidden text-sm font-medium text-gray-200 hover:text-white md:block'
          >
            About
          </Link>

          <ConnectButton
            accountStatus='address'
            showBalance={false}
            chainStatus='icon'
          />
        </div>
      </div>
    </nav>
  );
}
