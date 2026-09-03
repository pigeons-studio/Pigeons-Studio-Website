'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useRouter } from '@/i18n/routing';
import styles from './LinuxTerminal.module.css';

type FileSystemNode = { [key: string]: FileSystemNode | string };

type PromptEntry = {
  prompt: string;
  location: string;
  error: boolean;
  answer: string;
  banner?: boolean;
};

const HOME_DIRECTORY = '/root';

const FILE_SYSTEM: FileSystemNode = {
  bin: {},
  boot: {},
  dev: {
    null: '',
    tty1: '',
    sda1: '',
  },
  etc: {
    hostname: 'pigeons-studio\n',
    issue: 'Pigeons GNU/Linux 6.8 \\n \\l\n',
    motd: 'Welcome to pigeons-studio.\nType cmds for a list of commands, or cat README.md.\n',
  },
  home: {
    pigeon: {
      'README.md':
        'home of pigeon\n\nYou probably want /root — that is where the studio files live.\n',
    },
  },
  root: {
    'README.md':
      'Welcome to the Pigeons Studio terminal.\n\nSupported commands:\n - cat      Print text files\n - cd       Change directory\n - clear    Clear the screen\n - cmds     List commands\n - help     Same as cmds\n - ls       List directory\n - pwd      Print working directory\n - reboot   Reboot the BIOS\n - shutdown Halt and return to the site\n - exit     Same as shutdown\n',
    'about.txt':
      'Pigeons Studio — Koo Des (NSDOS) × Julien Thomas\nCreative direction, robotics and spatialized sound.\n\nWe design devices where gesture becomes music, movement and collective experience — for stage, installation and brands.\n',
    '.secrets':
      'There is no cow level.\nroot password: pigeons\n(just kidding)\n',
    projects: {
      'as-simt.txt':
        'AS-SIMT / EightOS Motion Sensors\n\nWearable sensors turning movement into real-time visual, haptic and sonic feedback. Built by Julien and played on stage by Koo.\n\nPresented at Gwangju Biennale, IMPACT (Théâtre de Liège) and HOT-SHOP 14 (ECCO Leather).\nTags: haptic sensors, custom PCB, ESP32, OSC\n',
      'go2.txt':
        'Go2 (Unitree) Robotic Performance\n\nChoreographed movements, synchronization with light and audio, custom integrations. Performative projects including stage modules and interactive installations.\nTags: Unitree Go2, SDK, ROS2, choreography\n',
      'installations.txt':
        'Interactive Installations\n\nReal-time controlled stage devices, audio-light synchronization with sensor feedback. Dedicated electronics and firmware for modulations and effects.\nTags: I2S audio, 9-axis IMU, DMX/Art-Net, sync\n',
    },
  },
  tmp: {},
  usr: {
    bin: {},
    share: {},
  },
  var: {
    log: {
      'syslog': 'Sep  3 23:35:01 pigeons-studio kernel: BIOS handoff complete\n',
    },
  },
};

function isDirectory(node: FileSystemNode | string | undefined): node is FileSystemNode {
  return typeof node === 'object' && node !== null;
}

function resolvePath(base: string, param: string): string {
  let target = param;
  if (!target || target === '~') {
    return HOME_DIRECTORY;
  }
  if (target.startsWith('~/')) {
    target = `${HOME_DIRECTORY}${target.slice(1)}`;
  }
  const raw = target.startsWith('/') ? target : `${base}/${target}`;
  const parts = raw.split('/').filter((part) => part.length > 0);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return `/${stack.join('/')}`;
}

function walkPath(path: string): FileSystemNode | string | undefined {
  if (path === '/') {
    return FILE_SYSTEM;
  }
  const parts = path.split('/').filter((part) => part.length > 0);
  let current: FileSystemNode | string = FILE_SYSTEM;
  for (const part of parts) {
    if (!isDirectory(current) || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

function splitFirstWord(text: string): [string, string] {
  const trimmed = text.trimStart();
  const firstSpaceIndex = trimmed.indexOf(' ');
  if (firstSpaceIndex === -1) {
    return [trimmed, ''];
  }
  return [trimmed.substring(0, firstSpaceIndex), trimmed.substring(firstSpaceIndex + 1).trim()];
}

function isWhitespaces(str: string) {
  return str.trim().length === 0;
}

function formatPromptPath(path: string) {
  if (path === HOME_DIRECTORY) {
    return '~';
  }
  if (path.startsWith(`${HOME_DIRECTORY}/`)) {
    return `~${path.slice(HOME_DIRECTORY.length)}`;
  }
  return path;
}

function PromptPrefix({ location, error }: { location: string; error: boolean }) {
  return (
    <>
      <span className={error ? styles.red : styles.host}>root@pigeons-studio</span>
      <span className={styles.white}>:</span>
      <span className={styles.path}>{formatPromptPath(location)}</span>
      <span className={styles.white}>#&nbsp;</span>
    </>
  );
}

export default function LinuxTerminal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState(HOME_DIRECTORY);
  const [oldDirectory, setOldDirectory] = useState(HOME_DIRECTORY);
  const [lastPromptError, setLastPromptError] = useState(false);
  const [promptHistoryIndex, setPromptHistoryIndex] = useState(0);
  const [tmpPrompt, setTmpPrompt] = useState('');
  const [prompt, setPrompt] = useState('');
  const [oldPrompts, setOldPrompts] = useState<PromptEntry[]>([
    {
      prompt: '',
      location: HOME_DIRECTORY,
      error: false,
      banner: true,
      answer:
        'Welcome to pigeons-studio.\n\n * Documentation:  cat README.md\n * Commands:       cmds\n',
    },
  ]);

  const scrollToBottom = () => {
    window.setTimeout(() => {
      const node = scrollRef.current;
      if (node) {
        node.scrollTop = node.scrollHeight;
      }
    }, 0);
  };

  const listDirectory = (param: string): { output: string; ok: boolean } => {
    const flags = param.trim().split(/\s+/).filter(Boolean);
    const showHidden = flags.includes('-a') || flags.includes('-la') || flags.includes('-al');
    const pathArg = flags.find((flag) => !flag.startsWith('-')) ?? '';
    const targetPath = pathArg ? resolvePath(currentDirectory, pathArg) : currentDirectory;
    const node = walkPath(targetPath);

    if (typeof node === 'string') {
      const name = pathArg.split('/').filter(Boolean).at(-1) ?? pathArg;
      return { output: name, ok: true };
    }

    if (!isDirectory(node)) {
      return {
        output: `ls: cannot access '${pathArg || targetPath}': No such file or directory`,
        ok: false,
      };
    }

    const names = Object.keys(node)
      .filter((name) => showHidden || !name.startsWith('.'))
      .sort((a, b) => a.localeCompare(b));
    return { output: names.join('\n'), ok: true };
  };

  const catCommand = (param: string): { output: string; ok: boolean } => {
    if (!param) {
      return { output: 'Usage: cat [filename]', ok: false };
    }
    const targetPath = resolvePath(currentDirectory, param);
    const node = walkPath(targetPath);
    if (node === undefined) {
      return { output: `cat: ${param}: No such file or directory`, ok: false };
    }
    if (isDirectory(node)) {
      return { output: `cat: ${param}: Is a directory`, ok: false };
    }
    return { output: node, ok: true };
  };

  const changeDirectory = (param: string): { output: string; ok: boolean } => {
    if (param === '-') {
      const previous = oldDirectory;
      setOldDirectory(currentDirectory);
      setCurrentDirectory(previous);
      return { output: '', ok: true };
    }
    const targetPath = resolvePath(currentDirectory, param);
    const node = walkPath(targetPath);
    if (!isDirectory(node)) {
      return { output: `cd: no such file or directory: ${param || targetPath}`, ok: false };
    }
    setOldDirectory(currentDirectory);
    setCurrentDirectory(targetPath);
    return { output: '', ok: true };
  };

  const commandList = [
    'cat',
    'cd',
    'clear',
    'cmds',
    'exit',
    'help',
    'ls',
    'pwd',
    'reboot',
    'shutdown',
  ];

  const commands: Record<string, (params: string) => { output: string; ok: boolean }> = {
    cat: catCommand,
    cd: changeDirectory,
    clear: () => {
      setOldPrompts([]);
      return { output: '', ok: true };
    },
    cmds: () => ({
      output: `Supported commands are:\n${commandList.map((key) => ` - ${key}`).join('\n')}`,
      ok: true,
    }),
    help: () => commands.cmds(''),
    ls: listDirectory,
    pwd: () => ({ output: currentDirectory, ok: true }),
    reboot: () => {
      window.setTimeout(() => {
        window.location.reload();
      }, 200);
      return { output: 'Rebooting...', ok: true };
    },
    shutdown: () => {
      window.setTimeout(() => {
        router.push('/');
      }, 200);
      return { output: 'Halting...', ok: true };
    },
    exit: () => commands.shutdown(''),
  };

  const executePrompt = () => {
    const raw = prompt;
    const [promptFunction, promptParams] = splitFirstWord(raw.trim());

    if (promptFunction === 'clear') {
      commands.clear('');
      setLastPromptError(false);
      setPrompt('');
      setPromptHistoryIndex(0);
      scrollToBottom();
      return;
    }

    let error = lastPromptError;
    let answer = '';
    if (promptFunction) {
      if (commands[promptFunction]) {
        const result = commands[promptFunction](promptParams);
        answer = result.output;
        error = !result.ok;
      } else {
        error = true;
        answer = `bash: ${promptFunction}: command not found`;
      }
      setLastPromptError(error);
    }

    setOldPrompts((old) => [
      ...old,
      {
        prompt: raw,
        location: currentDirectory,
        error,
        answer,
      },
    ]);
    setPrompt('');
    setPromptHistoryIndex(0);
    scrollToBottom();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      executePrompt();
    }
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const history = oldPrompts.filter((entry) => !isWhitespaces(entry.prompt));
      if (!history.length) return;
      if (promptHistoryIndex === 0) {
        setTmpPrompt(prompt);
      }
      const nextIndex =
        history.length - 1 > promptHistoryIndex ? promptHistoryIndex + 1 : promptHistoryIndex;
      const lastPrompt = history[history.length - nextIndex].prompt;
      setPromptHistoryIndex(nextIndex);
      setPrompt(lastPrompt);
      window.setTimeout(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
          inputElement.focus();
          inputElement.setSelectionRange(lastPrompt.length, lastPrompt.length);
        }
      }, 0);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const history = oldPrompts.filter((entry) => !isWhitespaces(entry.prompt));
      if (!history.length) return;
      if (promptHistoryIndex <= 1) {
        setPrompt(tmpPrompt);
        setPromptHistoryIndex(0);
      } else {
        const nextIndex = promptHistoryIndex - 1;
        const lastPrompt = history[history.length - nextIndex].prompt;
        setPromptHistoryIndex(nextIndex);
        setPrompt(lastPrompt);
        window.setTimeout(() => {
          const inputElement = inputRef.current;
          if (inputElement) {
            inputElement.focus();
            inputElement.setSelectionRange(lastPrompt.length, lastPrompt.length);
          }
        }, 0);
      }
    }
    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      setOldPrompts((old) => [
        ...old,
        {
          prompt: `${prompt}^C`,
          error: lastPromptError,
          location: currentDirectory,
          answer: '',
        },
      ]);
      setPrompt('');
      setPromptHistoryIndex(0);
    }
    scrollToBottom();
  };

  return (
    <div
      ref={scrollRef}
      className={styles.terminal}
      onClick={() => inputRef.current?.focus()}
    >
      {oldPrompts.map((entry, index) => (
        <div className={styles.entry} key={`${entry.location}-${index}`}>
          {entry.banner ? null : (
            <p className={styles.line}>
              <PromptPrefix location={entry.location} error={entry.error} />
              <span className={styles.white}>{entry.prompt}</span>
            </p>
          )}
          {entry.answer ? <p className={styles.output}>{entry.answer}</p> : null}
        </div>
      ))}
      <div className={styles.liveLine}>
        <PromptPrefix location={currentDirectory} error={lastPromptError} />
        <input
          ref={inputRef}
          type="text"
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          aria-label="Linux terminal input"
        />
      </div>
    </div>
  );
}
