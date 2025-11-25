{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nix-vscode-extensions.url = "github:nix-community/nix-vscode-extensions";

  outputs =
    inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import inputs.nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [ inputs.nix-vscode-extensions.overlays.default ];
        };
      in
      {
        packages.default = pkgs.vscode-with-extensions.override {
          vscode = pkgs.vscodium;
          vscodeExtensions = (
            (with pkgs.open-vsx-release; [
              # Infrastructure
              mkhl.direnv
              jnoortheen.nix-ide
              # Developing
              ms-python.python
              ms-toolsai.jupyter
              # Linting/Formatting
              charliermarsh.ruff
              detachhead.basedpyright
              editorconfig.editorconfig
              # Misc
              tomoki1207.pdf
              streetsidesoftware.code-spell-checker
              streetsidesoftware.code-spell-checker-german
            ])
          );
        };

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            # Infrastructure
            nil
            # Developing
            (python3.withPackages (python-pkgs: [
              # API
              python-pkgs.youtube-transcript-api
              # Data
              python-pkgs.jupyter
              python-pkgs.pandas
              python-pkgs.scipy
              # Visualizing
              python-pkgs.matplotlib
            ]))
            pnpm
            nodejs_24
          ];
        };
      }
    );
}
