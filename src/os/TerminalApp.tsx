"use client";

import { useEffect, useRef, useState } from "react";

interface HistoryItem {
  id: number;
  text: string;
  type: "input" | "output" | "system";
}

export default function TerminalApp() {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 0,
      text: "Microsoft(R) Windows 95 [Version 4.00.950]",
      type: "system",
    },
    { id: 1, text: "(C) Copyright Microsoft Corp 1981-1999.", type: "system" },
    { id: 2, text: "", type: "system" },
    { id: 3, text: 'Type "help" to see available commands.', type: "output" },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * 🚀 LOCAL COMMAND HANDLER
   * Replaces the broken fetch('/api/terminal') call.
   * Works perfectly in Vite without a backend server.
   */
  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // 1. Add user input to history immediately
    const newUserInput: HistoryItem = {
      id: Date.now(),
      text: `> ${cmd}`,
      type: "input",
    };

    setHistory((prev) => [...prev, newUserInput]);
    setInput("");
    setIsLoading(true);

    // Simulate network latency for realism
    await new Promise((resolve) => setTimeout(resolve, 300));

    const lowerCmd = cmd.toLowerCase().trim();
    let output = "";

    // 2. Process Command Locally
    switch (true) {
      case lowerCmd === "help":
        output = [
          "Available Commands:",
          "> whoami   : Who is Ralph?",
          "> ls       : List projects",
          "> cat <file>: Read details (e.g., cat pebrusa)",
          "> clear    : Clear screen",
          "> date     : Current system time",
          "> sudo hire: Initiate hiring protocol 😉",
        ].join("\n");
        break;

      case lowerCmd === "whoami":
        output = "RALPH D. TUNGCUL | Full Stack Engineer | Quezon City, PH";
        break;

      case lowerCmd === "ls" || lowerCmd === "dir":
        output =
          "PEBRUSA_SaaS/\n" +
          "NURSE_SCHEDULER/\n" +
          "VILT_CLIENT_APPS/\n" +
          "PORTFOLIO_OS/";
        break;

      case lowerCmd.startsWith("cat "): {
        const fileName = lowerCmd.replace("cat ", "").trim();

        if (fileName === "pebrusa") {
          output =
            "PROJECT: PEBRUSA SAAS\n" +
            "ROLE: Full Stack Developer\n" +
            "YEAR: 2026\n" +
            "STACK: Next.js, TypeScript, Prisma, MySQL, Auth.js, Vercel, Gemini AI\n" +
            "IMPACT: Reduced payload by 96% via client-side avatar optimization.\n" +
            "STATUS: Active Development";
        } else if (fileName === "portfolio_os") {
          output =
            "PROJECT: PORTFOLIO OS 95\n" +
            "ROLE: Creator / Frontend Lead\n" +
            "YEAR: 2024-2026\n" +
            "STACK: React, TypeScript, CSS Modules, LocalStorage APIs\n" +
            "FEATURES: Draggable Windows, CRT Effects, Live Guestbook, Music Player\n" +
            "LINK: https://ralphtungcul.dev";
        } else if (fileName === "resume" || fileName === "cv") {
          output =
            "RESUME SUMMARY:\n" +
            "- Software Engineer at Tensei Philippines Inc. (Aug 2023 - Present)\n" +
            "- Project Supervisor at Wuhan Fiberhome (Sep 2020 - Apr 2022)\n" +
            "- B.S. Electronics Communication Engineering, USL-Tuguegarao\n" +
            "\nTo download PDF: Visit ralphtungcul.dev/resume.pdf";
        } else {
          output = `File '${fileName}' not found. Try 'ls' to see available files.`;
        }
        break;
      }

      case lowerCmd === "clear":
        setHistory([]);
        setIsLoading(false);
        return; // Exit early, no output needed

      case lowerCmd === "date" || lowerCmd === "time":
        output = new Date().toString();
        break;

      case lowerCmd.includes("sudo"):
        output =
          "Permission denied. \n" +
          "Just kidding! Email me at tungculralph15@gmail.com 📧";
        break;

      default:
        output = `'${lowerCmd}' is not recognized as an internal or external command.\nType 'help' for options.`;
    }

    // 3. Add response to history
    const newOutput: HistoryItem = {
      id: Date.now() + 1,
      text: output,
      type: "output",
    };

    setHistory((prev) => [...prev, newOutput]);
    setIsLoading(false);

    // Refocus input after typing
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div className="terminal-container">
      <div className="terminal-output">
        {history.map((item) => (
          <div key={item.id} className={`term-line term-${item.type}`}>
            {item.text.split("\n").map((line, i) => (
              <p key={i} style={{ margin: 0 }}>
                {line}
              </p>
            ))}
          </div>
        ))}
        {isLoading && <span className="cursor-blink">_</span>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="terminal-input-row">
        <span className="prompt">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
