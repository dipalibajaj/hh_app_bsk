## Ho Health Data Processor
This is a microservice that processes the medical reports of users.

## Setting up the Project
### System Dependencies
* Python Dependencies
```bash
sudo apt-get update; sudo apt-get install make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
```
* Install tesseract-ocr
`sudo apt-get install tesseract-ocr`
* Install poppler dependency
`sudo apt-get install -y libpoppler-cpp-dev` & `sudo apt-get install poppler-utils`

### Python Environment Setup
You may use pyenv for Environment setup for python - [How to Setup pyenv](https://realpython.com/intro-to-pyenv/)
* Setup python virtual environment
`python -m venv .venv`
* Activate the environment
`source .venv/bin/activate`
* Install all dependencies
`pip install -r requirements.txt`

## Using the Command Line Tool
### Command Line Commands
* Perform OCR on PDF
`python ho-cli.py convert --path_in temp/reports/Blood_Report.pdf --path_out temp/output_blood.txt`
* Extract Reports
`python ho-cli.py extract --path_in temp/output_blood.txt --path_out temp/extracted_blood_output.txt`