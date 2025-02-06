{
  description = "MEPhI360 Telegram Bot - A Python-based Telegram bot for MEPhI services";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Core Python dependencies
        pythonPackages = ps: with ps; [
          python-telegram-bot
          beautifulsoup4
          requests
          numpy
          matplotlib
          psycopg2
          bcrypt
          sqlalchemy
          asyncpg
          python-dotenv
          aiohttp
          cryptography
          prometheus-client
        ];

        # Create a Python environment with all dependencies
        pythonEnv = pkgs.python3.withPackages pythonPackages;

        # Development tools
        devTools = with pkgs; [
          black
          pyright
          (python3.withPackages (ps: with ps; [
            flake8
            isort
            pytest
            pytest-asyncio
            mypy
          ] ++ pythonPackages ps))

          git

          postgresql

          nodejs
          swc
          typescript
        ];

        # Application package
        mephi360Bot = pkgs.python3Packages.buildPythonApplication {
          pname = "mephi360-bot";
          version = "0.1.0";
          src = ./.;

          format = "setuptools"; # or "pyproject" if you want to keep pyproject.toml

          propagatedBuildInputs = pythonPackages pkgs.python3Packages;

          checkInputs = with pkgs.python3Packages; [
            pytest
            pytest-asyncio
          ];

          # Ensure source directories are recognized as Python packages
          postPatch = ''
            # Create __init__.py files if they don't exist
            touch src/bot/__init__.py
            touch src/bot/handlers/__init__.py
            touch src/bot/keyboards/__init__.py
            touch src/models/__init__.py
            touch src/utils/__init__.py
          '';
        };

      in {
        packages = {
          default = mephi360Bot;
          mephi360Bot = mephi360Bot;
        };

        apps.default = flake-utils.lib.mkApp {
          drv = mephi360Bot;
          name = "mephi360-bot";
        };

        devShells.default = pkgs.mkShell {
          name = "mephi360-bot-dev";

          packages = devTools;
          inputsFrom = [ mephi360Bot ];

          shellHook = ''
            # Setup Python environment
            export PYTHONPATH="$PWD/src:$PYTHONPATH"

            # Setup Pyright configuration
            mkdir -p .direnv
            cat > .direnv/pyrightconfig.json << EOF
            {
              "include": ["src"],
              "exclude": ["**/__pycache__", "**/.mypy_cache", "**/.pytest_cache"],
              "typeCheckingMode": "basic",
              "useLibraryCodeForTypes": true,
              "venvPath": "${pythonEnv}",
              "pythonPath": "${pythonEnv}/bin/python",
              "pythonVersion": "3.12",
              "reportMissingImports": true,
              "reportMissingTypeStubs": false
            }
            EOF

            # Setup VS Code settings if using VS Code
            mkdir -p .vscode
            cat > .vscode/settings.json << EOF
            {
              "python.analysis.typeCheckingMode": "basic",
              "python.analysis.diagnosticMode": "workspace",
              "python.pythonPath": "${pythonEnv}/bin/python",
              "python.formatting.provider": "black",
              "editor.formatOnSave": true
            }
            EOF

            echo
            echo "🚀 MEPhI360 Telegram Bot Development Environment"
            echo "Python: $(python --version)"
            echo
            echo "Available commands:"
            echo "- pytest        : Run tests"
            echo "- black .       : Format code"
            echo "- flake8        : Lint code"
            echo "- mypy src      : Type check"
            echo
          '';
        };
      });
}
