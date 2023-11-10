'''
CHECK COMPANY CC INFO (every day midnight)

check if company needs to fill in their CC info
condition: from the start of their 1st RFO - 7 days after
on the 7th day check if the company has filled in their CC info

if so, do nothing.

get list of companies that have not filled in their CC info
    (need to check if stripe API can tell us this ^)
get the earliest RFO from that company
    compare ^ RFO created date to today's date

    if > 7 days block company from creating new RFO's until CC info
        set enum STATUS: BLOCKED, UNBLOCKED


note: limit the amount of RFO's that can be created w/o CC info

'''

'''
CREATING INVOICE (run 1st or 15th of every month)

get list of all companies
    get billing period rfo's for that company
    
    Checks todays date and confirm the the billing period aligns with todays date.
        if not continue; 

    depending of the count of rfo's will determine the tier the company is in

    create new invoice row
        - start date 
        - end date
        - num rfos
        - tier cost
        - total 
        - tax 
    
    if a credit card is present, we will attempt to charge card

    if approved mark invoice.payment_complete = true;
    else mark invoice.payment_complete = false
'''