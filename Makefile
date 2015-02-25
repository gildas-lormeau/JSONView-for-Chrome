build:
	dirname=$(shell basename $(PWD)); cd WebContent; zip -r ../$$dirname.zip .
