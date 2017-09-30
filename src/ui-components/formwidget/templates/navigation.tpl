<div class=" text-center p-10">
    <%if(currentStep != "settings"){%>
        <a class="btn btn-link btn-sm waves-effect event-widget-back" href="#">
            <i class="zmdi zmdi-chevron-left"></i> <%=i18n.trans("Back")%>
        </a>
    <%}%>
    <%if(steps[currentStep].hasOwnProperty('completeBtn')){%>
        <a class="btn btn-success btn-sm waves-effect event-widget-next" href="#">
            <%- steps[currentStep].completeBtn %>
        </a>
    <%}else{%>
        <a class="btn btn-primary btn-sm waves-effect event-widget-next" href="#">
            <%=i18n.trans("Forward")%> <i class="zmdi zmdi-chevron-right"></i>
        </a>
    <%}%>
</div>