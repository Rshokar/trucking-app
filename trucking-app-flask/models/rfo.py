class RFO:
    def __init__(
            self,
            id,
            dispatcher,
            operator,
            trailer,
            truck,
            start_locaiton,
            dump_location,
            load_location):
        self.id = id
        self.dispatcher = dispatcher
        self.operator = operator
        self.trailer = trailer
        self.truck = truck
        self.start_location = start_locaiton
        self.dump_location = dump_location
        self.load_location = load_location
