--QUERY FOR SELL CAR TABLE - SELL CAR REQUESTS - IF NOT EXISTS I NEED TO RECREEATE THE TABLE:SELL CAR REQUESTS

CREATE TABLE IF NOT EXISTS public.sell_car_requests (
    request_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    classification_id INT NOT NULL,
    car_make VARCHAR(50) NOT NULL,
    car_model VARCHAR(50) NOT NULL,
    car_year INT NOT NULL,
    car_description TEXT NOT NULL,
    asking_price NUMERIC(10, 2) NOT NULL,
    car_miles INT NOT NULL,
    car_color VARCHAR(30) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (account_id) REFERENCES public.account(account_id),
    FOREIGN KEY (classification_id) REFERENCES public.classification(classification_id)
);

CREATE INDEX idx_sell_car_account ON public.sell_car_requests(account_id);
CREATE INDEX idx_sell_car_status ON public.sell_car_requests(status);