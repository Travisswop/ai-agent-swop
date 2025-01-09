'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Menu } from 'lucide-react';
import Image from 'next/image';

export function WalletPanel() {
  return (
    <div className="w-[300px] h-screen bg-[#1a1a1a] border-l border-[#2a2a2a]">
      <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
        <div>
          <h2 className="font-medium text-white">Wallet</h2>
          <p className="text-sm text-gray-400">DbK4bg</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="bg-[#2a2a2a] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="USDC"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <div className="text-white">USD Coin</div>
                  <div className="text-sm text-gray-400">
                    0.006032 USDC
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white">$0.01</div>
                <div className="text-sm text-gray-400">$1.00</div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a2a] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="PENGU"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <div className="text-white">Pudgy Penguins</div>
                  <div className="text-sm text-gray-400">
                    496.460981 PENGU
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white">$19.60</div>
                <div className="text-sm text-gray-400">$0.04</div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a2a] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="GRIFFAIN"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <div className="text-white">test.griffain.com</div>
                  <div className="text-sm text-gray-400">
                    1036.198467 GRIFFAIN
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white">$452.19</div>
                <div className="text-sm text-gray-400">$0.44</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
