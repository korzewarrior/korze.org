### Stop calling C++ headers `.h`

Here’s the short of it: if a header is meant only for C++, name it `something.hpp`. Leave `.h` for the rare files that really do compile under C as well.

Why I bother:
- My editor and linter flip into the right mode when they see `.hpp`, so I don’t get bogus warnings.
- A quick `grep --include='*.hpp'` skips every C header in the repo. Big time‑saver.
- New devs don’t have to ask whether `utils.h` is safe to include from C.

Nothing magical here—the pre‑processor will gladly pull in `sandwich.bun` if you ask. This is just about not tripping up people and tools. Two extra letters, endless micro‑wins.

Got mixed feelings? Keep the legacy `.h` files as‑is. For anything new that’s C++‑only, stick with `.hpp` and call it a day.

That’s it. Happy coding.

