# Multi table adder

## Overview

The project contains google apps script that allows adding data to multiple google spreadsheets at once.  

## Usage flow

At first, a user has to create a fillable template.
The fillable template contains the following elements:
- A list of spreadsheets to fill; the user specifies a spreadsheet and a sheet inside this spreadsheet using the spreadsheet's URL.
- A list of fields that should be added to spreadsheets.
- A mapping between columns of each spreadsheet and the fields; some fields can only be mapped to columns of a subset of spreadsheets.

Once the fillable template is ready, the user can utilize it.  
Using the template involves providing values to the fields specified in the template.  
When values are provided and the user presses the apply button, the values are added to the corresponding columns of the respective spreadsheets.

A user can have several fillable templates.
