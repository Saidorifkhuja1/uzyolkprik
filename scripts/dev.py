#!/usr/bin/env python3
import os
import signal
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VENV_PYTHON = ROOT / ".venv" / "bin" / "python"
PYTHON = str(VENV_PYTHON if VENV_PYTHON.exists() else sys.executable)


def run_step(label, command, cwd=ROOT):
    print(f"\n[{label}] {' '.join(command)}")
    completed = subprocess.run(command, cwd=cwd)
    if completed.returncode != 0:
        raise SystemExit(completed.returncode)


def start_process(label, command, cwd=ROOT):
    print(f"[{label}] starting: {' '.join(command)}")
    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    return subprocess.Popen(command, cwd=cwd, env=env)


def terminate(processes):
    for process in processes:
        if process.poll() is None:
            process.send_signal(signal.SIGTERM)
    for process in processes:
        if process.poll() is None:
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()


def main():
    run_step("backend", [PYTHON, "manage.py", "migrate"])

    processes = [
        start_process("backend", [PYTHON, "manage.py", "runserver", "127.0.0.1:8000", "--noreload"]),
        start_process("frontend", ["npm", "run", "dev"], cwd=ROOT / "frontend"),
    ]

    print("\nBackend:  http://127.0.0.1:8000")
    print("Frontend: http://127.0.0.1:3000")
    print("Swagger:  http://127.0.0.1:8000/swagger/")
    print("ReDoc:    http://127.0.0.1:8000/redoc/")
    print("Stop:     Ctrl+C\n")

    try:
        while True:
            for process in processes:
                code = process.poll()
                if code is not None:
                    terminate(processes)
                    return code
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping dev servers...")
        terminate(processes)
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
