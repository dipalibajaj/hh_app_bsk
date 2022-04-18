
from os import mkdir, path
import shutil
from pdf2image import convert_from_path
from PIL import Image
from pytesseract import image_to_string


def convert(pdf_path, output_path):
    print('Converting pages in file to images for processing with OCR')
    temp_path='temp/intermediate'
    if not path.exists(temp_path):
        mkdir(temp_path)
    image_filenames = convert_from_path(pdf_path, 500, output_folder=temp_path, paths_only= True)
    print(f'{len(image_filenames)} Pages converted.')
    print("Performing OCR, this might take a while depending on the size of the file.")
    output_file = open(output_path, "a")
    for file in image_filenames:
        # Recognize the text as string in image using pytesserct
        text = str(((image_to_string(Image.open(file)))))
        # The recognized text is stored in variable text
        # Any string processing may be applied on text
        # Here, basic formatting has been done:
        # In many PDFs, at line ending, if a word can't
        # be written fully, a 'hyphen' is added.
        # The rest of the word is written in the next line
        # Eg: This is a sample text this word here hello-
        # world is half on first line, remaining on next.
        # To remove this, we replace every '-\n' to ''.
        text = text.replace('-\n', '')    
        # Finally, write the processed text to the file.
        output_file.write(text)
        # Remove the temporary image file
        
    shutil.rmtree(temp_path, ignore_errors=True)
    print('OCR of all pages complete!')
    output_file.close()


