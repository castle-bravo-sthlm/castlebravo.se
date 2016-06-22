FROM openshift/nodejs-010-centos7
COPY ./package.json /app/
COPY ./packages /app/packages
WORKDIR /app
RUN npm install --ignore-scripts
COPY . /app
EXPOSE 9966
RUN npm run build
CMD npm start
