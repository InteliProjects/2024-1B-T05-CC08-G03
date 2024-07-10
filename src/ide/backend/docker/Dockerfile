FROM python:3

WORKDIR /usr/src/app

COPY compiler/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY compiler/ ./compiler

COPY ide/backend/bin/axe-backend ./
COPY ide/backend/docker/.env ./
RUN chmod +x axe-backend

CMD ["./axe-backend"]
