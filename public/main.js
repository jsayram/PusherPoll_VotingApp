var form = document.getElementById('vote-form');



//form submit event
form.addEventListener('submit', e => {
    e.preventDefault();

    const choice = document.querySelector('input[name=os]:checked').value;

    console.log(choice);

    //this be the data that we send to our post request
    const data = { os: choice };

    fetch('http://localhost:3000/poll', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
        
});


fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        //Count vote points for each one - two parameters accumulator(acc)/currentvalue(vote)
        const voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc), {});

        //implement canvasjs
        let dataPoints = [
            { label: 'Windows', y: voteCounts.Windows },
            { label: 'MacOs', y: voteCounts.MacOs },
            { label: 'Linux', y: voteCounts.Linux },
            { label: 'Other', y: voteCounts.Other },
        ];

        const chartContainer = document.querySelector('#chartContainer');

        if (chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes ${totalVotes}`
                },
                data: [{
                        type: 'column',
                        dataPoints: dataPoints
                    }

                ]
            });
            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('08dca85ad46924bc260e', {
                cluster: 'us2',
                encrypted: true
            });

            var channel = pusher.subscribe('os-poll');

            channel.bind('os-vote', function(data) {
                // alert(data.message);
                dataPoints = dataPoints.map(x => {
                    if (x.label == data.os) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                });
                chart.render();
            });
        }

    });