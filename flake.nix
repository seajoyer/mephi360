{
  description = "MEPhI360 Telegram Bot Project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python3Packages = pkgs.python3Packages;

        telegramBot = python3Packages.buildPythonApplication {
          pname = "mephi360-bot";
          version = "0.1.0";
          src = ./.;
          propagatedBuildInputs = with python3Packages; [
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
          ];
        };
      in {
        packages.default = telegramBot;

        apps.default = flake-utils.lib.mkApp { drv = telegramBot; };

        devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [ python3 pyright git poetry ];

          buildInputs = with python3Packages; [
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
          ];

          nativeCheckInputs = with python3Packages; [
            black
            flake8
            isort
            pytest
          ];

          shellHook = ''
            alias c="clear"

            echo
            echo "---"
            echo "MEPhI360 Telegram Bot development environment"
            echo "$(python --version)"
            echo "---"
            echo
          '';
        };
      });
}
