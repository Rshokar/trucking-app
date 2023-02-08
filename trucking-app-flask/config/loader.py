from models.user import User
from models.company import Company
from faker import Faker

fake = Faker() 

def loadDB(session, num_users):
    ## iterate for numUsers
    users = generateUser(num_users);
    for i in range(len(users)):
        session.add(users[i])
        session.add(Company(i + 1, fake.name() + " Ltd"))
        

    # Before leaving commint everything to db
    session.commit()
    session.close()

def generateUser(num_users):
    ## Create Users
    results = []
    for i in range(num_users): 
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
