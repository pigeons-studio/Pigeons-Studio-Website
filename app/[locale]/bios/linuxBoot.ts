export type LinuxBootSound = 'ok' | 'tick' | 'none';

export type LinuxBootLine = {
  text: string;
  delayMs: number;
  sound: LinuxBootSound;
};

export const LINUX_BOOT_LINES: LinuxBootLine[] = [
  {
    text: '[    0.000000] Linux version 6.8.0-pigeons (root@pigeons-studio) (gcc (Debian 13.2.0-25) 13.2.0, GNU ld 2.42) #1 SMP PREEMPT_DYNAMIC',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.8.0-pigeons root=/dev/sda1 ro quiet splash',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[    0.000000] BIOS-provided physical RAM map:',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable',
    delayMs: 45,
    sound: 'tick',
  },
  {
    text: '[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000007fffffff] usable',
    delayMs: 45,
    sound: 'tick',
  },
  {
    text: '[    0.000000] NX (Execute Disable) protection: active',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[    0.000000] DMI: Pigeons Studio / BIOS 1.0, BIOS Date 09/03/2026',
    delayMs: 60,
    sound: 'tick',
  },
  {
    text: '[    0.048112] Hypervisor detected: none',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[    0.091440] Memory: 16384MB available (2048K kernel code, 512K rwdata, 1024K rodata)',
    delayMs: 65,
    sound: 'tick',
  },
  {
    text: '[    0.142117] x86/fpu: Supporting XSAVE feature 0x001: \'x87 floating point registers\'',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[    0.142184] x86/fpu: Supporting XSAVE feature 0x002: \'SSE registers\'',
    delayMs: 45,
    sound: 'tick',
  },
  {
    text: '[    0.142201] x86/fpu: Supporting XSAVE feature 0x004: \'AVX registers\'',
    delayMs: 45,
    sound: 'tick',
  },
  {
    text: '[    0.188332] ACPI: Core revision 20230628',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[    0.221904] pci 0000:00:1f.3: [8086:2668] type 00 class 0x040300 Audio device',
    delayMs: 60,
    sound: 'tick',
  },
  {
    text: '[    0.268441] usbcore: registered new interface driver usbfs',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[    0.318402] smp: Brought up 1 node, 4 CPUs',
    delayMs: 80,
    sound: 'tick',
  },
  {
    text: '[    0.355012] PCI: Using ACPI for IRQ routing',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[    0.401228] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x1cd42ea2e51',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[    0.448771] net: Registered PF_INET protocol family',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[    0.492330] i8042: PNP: PS/2 Controller [PNP0303:KBD,PNP0f13:PS2M] at 0x60,0x64 irq 1,12',
    delayMs: 60,
    sound: 'tick',
  },
  {
    text: '[    0.551882] EXT4-fs (sda1): mounted filesystem with ordered data mode. Quota mode: none.',
    delayMs: 90,
    sound: 'tick',
  },
  {
    text: '[    0.602114] VFS: Mounted root (ext4 filesystem) readonly on device 8:1.',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[    0.648901] devtmpfs: mounted',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[    0.701445] Freeing unused kernel image (initmem) memory: 2048K',
    delayMs: 60,
    sound: 'tick',
  },
  {
    text: '[    0.744220] Run /sbin/init as init process',
    delayMs: 80,
    sound: 'tick',
  },
  {
    text: '[    0.801002] systemd[1]: systemd 255.4-1 running in system mode (+PAM +AUDIT +SELINUX)',
    delayMs: 90,
    sound: 'tick',
  },
  {
    text: '[    0.848776] systemd[1]: Detected architecture x86-64.',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[    0.902331] systemd[1]: Hostname set to <pigeons-studio>.',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Created slice Slice /system/getty.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Path Units.',
    delayMs: 55,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Slice Units.',
    delayMs: 50,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Swaps.',
    delayMs: 50,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Listening on Journal Socket.',
    delayMs: 70,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Listening on udev Control Socket.',
    delayMs: 55,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started Journal Service.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '         Starting Load Kernel Modules...',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Finished Load Kernel Modules.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '         Starting Apply Kernel Variables...',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Finished Apply Kernel Variables.',
    delayMs: 70,
    sound: 'ok',
  },
  {
    text: '         Mounting /boot...',
    delayMs: 60,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Mounted /boot.',
    delayMs: 70,
    sound: 'ok',
  },
  {
    text: '         Mounting Huge Pages File System...',
    delayMs: 50,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Mounted Huge Pages File System.',
    delayMs: 55,
    sound: 'ok',
  },
  {
    text: '         Starting Remount Root and Kernel File Systems...',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Finished Remount Root and Kernel File Systems.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Local File Systems.',
    delayMs: 70,
    sound: 'ok',
  },
  {
    text: '         Starting Load/Save Random Seed...',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Finished Load/Save Random Seed.',
    delayMs: 60,
    sound: 'ok',
  },
  {
    text: '         Starting Create System Users...',
    delayMs: 55,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Finished Create System Users.',
    delayMs: 60,
    sound: 'ok',
  },
  {
    text: '         Starting Flush Journal to Persistent Storage...',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Finished Flush Journal to Persistent Storage.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started udev Kernel Device Manager.',
    delayMs: 75,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started udev Coldplug all Devices.',
    delayMs: 70,
    sound: 'ok',
  },
  {
    text: '         Starting Network Manager...',
    delayMs: 80,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started Network Manager.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Network.',
    delayMs: 60,
    sound: 'ok',
  },
  {
    text: '         Starting Pigeons Sensor Bus...',
    delayMs: 80,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started Pigeons Sensor Bus.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '         Starting AS-SIMT Motion Stack...',
    delayMs: 85,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started AS-SIMT Motion Stack.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '         Starting Audio Stack...',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started Audio Stack.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Sound Card.',
    delayMs: 60,
    sound: 'ok',
  },
  {
    text: '         Starting Spatial Audio Router...',
    delayMs: 75,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started Spatial Audio Router.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '         Starting DMX / Art-Net Bridge...',
    delayMs: 70,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started DMX / Art-Net Bridge.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '         Starting Unitree Go2 Interface...',
    delayMs: 90,
    sound: 'tick',
  },
  {
    text: '[  OK  ] Started Unitree Go2 Interface.',
    delayMs: 95,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started OpenSSH Daemon.',
    delayMs: 65,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started Chrony NTP daemon.',
    delayMs: 55,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target System Time Set.',
    delayMs: 50,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Timers.',
    delayMs: 50,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Listening on D-Bus System Message Bus Socket.',
    delayMs: 60,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Started D-Bus System Message Bus.',
    delayMs: 70,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Multi-User System.',
    delayMs: 90,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Reached target Graphical Interface.',
    delayMs: 80,
    sound: 'ok',
  },
  {
    text: '[  OK  ] Startup finished in 1.284s (kernel) + 4.712s (userspace) = 5.996s.',
    delayMs: 140,
    sound: 'tick',
  },
  { text: '', delayMs: 220, sound: 'none' },
  {
    text: 'Pigeons GNU/Linux 6.8 pigeons-studio tty1',
    delayMs: 180,
    sound: 'ok',
  },
  { text: '', delayMs: 90, sound: 'none' },
  {
    text: 'pigeons-studio login: root (automatic login)',
    delayMs: 160,
    sound: 'tick',
  },
  { text: '', delayMs: 120, sound: 'none' },
];

export const LINUX_BOOT_DONE_PAUSE_MS = 800;
