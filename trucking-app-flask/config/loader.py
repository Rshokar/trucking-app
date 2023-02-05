from models.user import User
from faker import Faker

fake = Faker() 

def loadDB(session, numUsers):
    ## iterate for numUsers
    users = generateUser(numUsers);
    for user in users:
        session.add(user)

    # Before leaving commint everything to db
    session.commit()
    session.close()

def generateUser(numUsers):
    ## Create Users
    results = []
    for i in range(numUsers): 
        results.append(User(
            email= fake.email(), 
            password=generate_password(),
            type="dispatcher"
        ))

    return results
    

def generate_password():
    # generate random password of length 8
    password = fake.password(length=8, special_chars=False, digits=True, upper_case=True, lower_case=True)
    while not (any(c.isdigit() for c in password) and any(c.isupper() for c in password) and any(c.islower() for c in password)):
        password = fake.password(length=8, special_chars=False, digits=True, upper_case=True, lower_case=True)
    return password
