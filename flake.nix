{
  description = "MEPhI-360 - A student platform with Telegram bot integration";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Python dependencies for Telegram bot
        pythonPackages = ps: with ps; [
          python-telegram-bot
          requests
          python-dotenv
          aiohttp
          sqlalchemy
          asyncpg
        ];

        # Create Python environment
        pythonEnv = pkgs.python3.withPackages pythonPackages;

        # Java dependencies and tools
        javaTools = with pkgs; [
          jdk17
          maven
          spring-boot-cli
        ];

        # Frontend tools
        frontendTools = with pkgs; [
          nodejs_20
          yarn
          typescript
        ];

        # Development tools
        devTools = with pkgs; [
          # Python development tools
          black
          pyright
          (python3.withPackages (ps: with ps; [
            flake8
            isort
            pytest
            pytest-asyncio
            mypy
          ] ++ pythonPackages ps))

          # Java development tools
          javaTools

          # Frontend development tools
          frontendTools

          # General development tools
          git
          docker
          docker-compose

          # Database
          postgresql
        ];

        # Application packages
        mephi360Bot = pkgs.python3Packages.buildPythonApplication {
          pname = "mephi360-bot";
          version = "0.1.0";
          src = ./telegram-bot;
          format = "setuptools";
          propagatedBuildInputs = pythonPackages pkgs.python3Packages;
          checkInputs = with pkgs.python3Packages; [ pytest pytest-asyncio ];
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

        devShells = {
          default = pkgs.mkShell {
            name = "mephi360-dev";
            packages = devTools;
            inputsFrom = [ mephi360Bot ];

            shellHook = ''
              # Setup Python environment
              export PYTHONPATH="$PWD/telegram-bot/src:$PYTHONPATH"

              # Setup Java environment
              export JAVA_HOME="${pkgs.jdk17}"
              export MAVEN_HOME="${pkgs.maven}"
              export PATH="$MAVEN_HOME/bin:$PATH"

              # Setup Node environment
              export PATH="$PWD/frontend/node_modules/.bin:$PATH"

              # Setup development configurations
              mkdir -p .direnv

              # Pyright configuration
              cat > .direnv/pyrightconfig.json << EOF
              {
                "include": ["telegram-bot/src"],
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

              # VS Code settings
              mkdir -p .vscode
              cat > .vscode/settings.json << EOF
              {
                "python.analysis.typeCheckingMode": "basic",
                "python.analysis.diagnosticMode": "workspace",
                "python.pythonPath": "${pythonEnv}/bin/python",
                "python.formatting.provider": "black",
                "java.configuration.updateBuildConfiguration": "automatic",
                "java.format.enabled": true,
                "editor.formatOnSave": true
              }
              EOF

              echo "🚀 MEPhI-360 Development Environment"
              echo "Python: $(python --version)"
              echo "Java: $(java --version | head -n 1)"
              echo "Node: $(node --version)"
              echo
              echo "Available commands:"
              echo "Python:"
              echo "- pytest        : Run Python tests"
              echo "- black .       : Format Python code"
              echo "- flake8        : Lint Python code"
              echo "- mypy src      : Type check Python code"
              echo
              echo "Java:"
              echo "- mvn clean install : Build Java project"
              echo "- mvn spring-boot:run : Run Spring Boot application"
              echo
              echo "Frontend:"
              echo "- yarn install  : Install dependencies"
              echo "- yarn start    : Start development server"
              echo "- yarn build    : Build production bundle"
              echo
            '';
          };

          bot = pkgs.mkShell {
            name = "mephi360-bot-dev";
            packages = with pkgs; [
              pythonEnv
              black
              pyright
              flake8
              git
            ];
          };

          backend = pkgs.mkShell {
            name = "mephi360-backend-dev";
            packages = javaTools;
          };

          frontend = pkgs.mkShell {
            name = "mephi360-frontend-dev";
            packages = frontendTools;
          };
        };
      });
}
