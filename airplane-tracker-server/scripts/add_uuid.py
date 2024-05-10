import argparse
import csv
import uuid

# add uuid field to each row
def add_uuid_to_csv(input_file, output_file):
    with open(input_file, 'r') as csvfile:
        reader = csv.DictReader(csvfile)

        fieldnames = reader.fieldnames + ['uuid']
        
        with open(output_file, 'w', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for row in reader:
                row['uuid'] = str(uuid.uuid4())
                writer.writerow(row)

def main():
    parser = argparse.ArgumentParser(description='Add UUID field to a CSV file')
    parser.add_argument('input_file', type=str, help='Input CSV file path')
    parser.add_argument('output_file', type=str, help='Output CSV file path')
    args = parser.parse_args()
    
    add_uuid_to_csv(args.input_file, args.output_file)

if __name__ == "__main__":
    main()