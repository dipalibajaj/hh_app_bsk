
from decimal import Decimal
import re
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def extract_report_lines(file_path:str, output_path:str):
    regex_str="^([\w\-'\s]+)\s+((\d*[.])?\d+)\s+(.+)\s+((\d*[.])?\d+)\s*-\s*((\d*[.])?\d+).*$"
    output_file = open(output_path, "a")
    with open(file_path) as infile:
        for line in infile:
            text = re.search(regex_str, line)
            if text:
                name=text.group(1)
                value=Decimal(text.group(2))
                min_val=Decimal(text.group(5))
                max_val=Decimal(text.group(7))
                delta = Decimal(0)
                category = 'Normal'
                if value < min_val:
                    delta = min_val-value
                    category = 'Low'
                if value > max_val:
                    delta = value-max_val
                    category = 'High'
                string=f'---{name} || {value} || {min_val}-{max_val} || {category}[{delta}]\n'
                output_file.write(string)
                if category=='High':
                    print(f"---{name} || {value} || {min_val}-{max_val} || {bcolors.FAIL}{category}[{delta}]{bcolors.ENDC}")
                if category=='Low':
                    print(f"---{name} || {value} || {min_val}-{max_val} || {bcolors.WARNING}{category}[{delta}]{bcolors.ENDC}")
    output_file.close()
