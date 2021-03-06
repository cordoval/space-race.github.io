$(function() {

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // GitHub Milestone Issue HTML Generator
    $('[data-milestones-repo]').each(function(index, el) {

        var $container = $(el);
        var repo = $container.attr('data-milestones-repo');

        // https://api.github.com/repos/space-race/mc-core/milestones
        // https://api.github.com/repos/space-race/mc-core/issues?state=open&milestone=1

        $.getJSON('https://api.github.com/repos/' + repo + '/issues?state=open&per_page=200', function(issues) {

            $.getJSON('https://api.github.com/repos/' + repo + '/milestones', function(milestones) {
                milestones.forEach(function(ms) {
                    var percentageComplete = Math.round(ms.closed_issues / (ms.closed_issues + ms.open_issues)*100);
                    var percentageToDisplay = (percentageComplete >= 8) ? percentageComplete : 8;
                    var $milestoneDiv = $('<div class="milestone"></div>');
                    var $milestoneProgressBar = $(
                      '<div class="progress">' +
                      '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+ percentageComplete +'" aria-valuemin="0" aria-valuemax="100" style="width: ' + percentageToDisplay + '%;">' +
                      ms.closed_issues + ' / ' + (ms.closed_issues + ms.open_issues) +
                      '</div>' +
                      '</div>');
                    var $issueList = $('<ul></ul>');
                    $milestoneDiv.append(
                      $('<h3></h3>')
                        .append(
                          $('<a target="_blank"></a>').text(ms.title).attr('href', ms.html_url)
                        )
                    );
                    $milestoneDiv.append($milestoneProgressBar);
                    $milestoneDiv.append($('<p></p>').text(ms.description));
                    $milestoneDiv.append($issueList);
                    issues.forEach(function(issue) {
                        if (issue.milestone !== null && issue.milestone.number === ms.number) {
                            $issueList.append(
                              $('<li></li>').append(
                                $('<a target="_blank"></a>').text(issue.title).attr('href', issue.html_url)
                              )
                            );
                        }
                    });
                    $container.append($milestoneDiv);
                });
            });

        });


    });

});
