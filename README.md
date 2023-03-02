# Fork-TeXnique

A (new) $\LaTeX$ speed-typesetting game. Test yourself in single-player mode, or in multi-player mode in a customizeable lobby with friends. See [credits](#credits)!

## Setup

To run this project, you need to have `go` installed, at the version specified in the `go.mod` file.

You also need to generate a self-signed certificate -- a utility file to generate this has been provided at `certgen.bash`. You can run this using the following command:

```
bash certgen.bash
```

Afterwards, you can run the project using:

```
go run .
```

## Credits

This project was created to extend (the now relatively-unmaintained) [TeXnique](https://github.com/akshayravikumar/TeXnique) project, adding additional features and a competitions platform -- hence the name. Credits & huge props to the original creators for making it!
