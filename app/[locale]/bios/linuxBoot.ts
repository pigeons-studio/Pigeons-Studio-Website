export type LinuxBootSound = 'ok' | 'tick' | 'none';

export type LinuxBootLine = {
  text: string;
  delayMs: number;
  sound: LinuxBootSound;
};

export const LINUX_BOOT_LINES: LinuxBootLine[] = [
  {
    text: '[    0.000000] Linux version 6.8.0-pigeons (root@pigeons-studio) (gcc (Debian 13.2.0-25) 13.2.0, GNU ld 2.42) #1 SMP PREEMPT_DYNAMIC',
    delayMs: 90,
    sound: 'tick',
  },
  {
    text: '[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.8.0-pigeons root=/dev/sda1 ro quiet',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[    0.142117] x86/fpu: Supporting XSAVE feature 0x001: \'x87 floating point registers\'',
    delayMs: 80,
    sound: 'tick',
  },
  {
    text: '[    0.318402] smp: Brought up 1 node, 4 CPUs',
    delayMs: 110,
    sound: 'tick',
  },
  {
    text: '[    0.551882] EXT4-fs (sda1): mounted filesystem with ordered data mode',
    delayMs: 140,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started Journal Service.',
    delayMs: 180,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Mounted /boot.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Local File Systems.',
    delayMs: 100,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started Network Manager.',
    delayMs: 130,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started Pigeons Sensor Bus.',
    delayMs: 110,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started Audio Stack.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Sound Card.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Multi-User System.',
    delayMs: 160,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Startup finished in 1.284s (kernel) + 2.041s (userspace) = 3.325s.',
    delayMs: 220,
    sound: 'tick',
  },
  { text: '', delayMs: 280, sound: 'none' },
  {
    text: 'Pigeons GNU/Linux 6.8 pigeons-studio tty1',
    delayMs: 220,
    sound: 'ok',
  },
  { text: '', delayMs: 140, sound: 'none' },
];

export const LINUX_BOOT_DONE_PAUSE_MS = 700;
