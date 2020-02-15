#!/bin/bash
#
# checking script for ilogtail
# 
#
# version: 0.3.0

gLogtailCheckingToolVersion="0.3.0"

gWarningCount=0
gErrorCount=0

function logInfo()
{
    echo '[Info]:    ' $*
}

function logOK()
{
    echo -n '[Info]:    ' $*
    echo -en '\033[80G \033[32m' && echo [ OK ]
    echo -en '\033[0m'
}

function logWarning()
{
    gWarningCount=`expr $gWarningCount + 1`
    echo -n '[Warning]: ' $*
    echo -en '\033[80G \033[33m' && echo [ Warning ]
    echo -en '\033[0m'
}

function logError()
{
    gErrorCount=`expr $gErrorCount + 1`
    echo -n '[Error]:   ' $*
    echo -en '\033[80G \033[31m' && echo [ Error ]
    echo -en '\033[0m'
}

function logErrorEnd()
{
    echo -en '\033[31m'
    echo -n '[Error]: ' $*
    echo -en '\033[0m'
    exit 1
}

function logSuggestion()
{
    echo -en '\033[34m' 
    echo -e '[Suggestion]: ' $*
    echo -en '\033[0m'
}

function logInput()
{
    echo -en '\033[40;34m'
    echo -ne '[Input]: ' $*
    echo -en '\033[0m'
}


function checkSystemSupport()
{
    logInfo 'Check system support'
    systemBit=`getconf LONG_BIT`
    if [ $systemBit == 64 ] 
    then
        logOK 'Check system support OK.'
    else
        logError 'Logtail dont support ' $systemBit ' bit system.'
        exit
    fi 
    echo
}

gLogtailBinDir="/usr/local/ilogtail"

function findLogtailInstallLocation()
{
    # check cmd rpm
    if hash rpm 2>/dev/null;then
       # t4
       t4Flag=`rpm -qa | grep ali-sls-ilogtail | grep t4`
       if [ $? == 0 ]
       then
       gLogtailBinDir="/opt/taobao/install/ilogtail"
       return
       fi

       # ant
       antFlag=`rpm -qa | grep ali-sls-ilogtail | grep ant`
       if [ $? == 0 ]
       then
       gLogtailBinDir="/opt/taobao/install/ilogtail"
       return
       fi
    else
        logWarning 'No command rpm, use default logtail install dir:' $gLogtailBinDir
    fi

}

findLogtailInstallLocation
#logInfo 'Logtail install dir: '$gLogtailBinDir
cd $gLogtailBinDir

gLogtailBinFile="ilogtail"
gLogtailInstallFiles=(
"ilogtail_config.json"
"/etc/init.d/ilogtaild"
"ilogtail"
)

function checkInstallFiles()
{
    logInfo 'Check logtail install files'
    for installFile in ${gLogtailInstallFiles[@]}
    do
        if [ -f $installFile ]
        then
            logOK 'Install file: ' $installFile 'exists.'
        else
            logError 'Install file: ' $installFile 'doesnt exist.'
            logSuggestion 'Make sure you have logtail installed, or try install logtail again.'
        fi
    done
    
    logtailRealBinPath=`ls -l ilogtail | grep -oP '/[0-9a-zA-Z\./=-_]*' 2>/dev/null`
    logtailVersion=`echo $logtailRealBinPath | grep -oP '[0-9\.]*' 2>/dev/null`
    #echo $logtailRealBinPath $logtailVersion
    if [ $? -ne 0 ]
    then
        logError 'Can`t find ilogtail link file.'
        logSuggestion 'Make sure you have logtail installed, or try install logtail again.'
        echo
        return 1
    fi
    if [ -f $logtailRealBinPath ]
    then
        logOK 'Bin file: ' $logtailRealBinPath 'exists.'
        logOK 'Logtail version : ' $logtailVersion
    else
        logError 'Logtail bin file: ' $logtailRealBinPath 'doesnt exist.'
        logSuggestion 'Make sure you have logtail installed, or try install logtail again.'
    fi
    echo
}

function checkLogtailStatus()
{
    logInfo "Check logtail running status"
    PPIDS_RAW=($(pgrep  -l -x -P 1,0 "ilogtail" | awk '{print $1}'))
    PPIDS_UPDATE=($(pgrep  -l -x -P 1,0 "ilogtail_[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}" | awk '{print $1}'))
    PPIDS=(${PPIDS_RAW[@]} ${PPIDS_UPDATE[@]})
    CPIDS=()
    for ppid in ${PPIDS[*]};
    do
        CPIDS=(${CPIDS[*]} $(pgrep -l -x -P "$ppid" "ilogtail.*" | awk '{print $1}'))
    done
    if [ ${#PPIDS[*]} == 0 ]
    then
        logError "Logtail is stopped"
        logSuggestion 'Try [/etc/init.d/ilogtaild start] to start logtail.'
        RETVAL=1
        return $RETVAL
    fi
    if [ ${#PPIDS[*]} != 1 -o ${#CPIDS[*]} != 1 ]
    then
        echo logtail ppid: ${PPIDS[*]}, cpid: ${CPIDS[*]}
        logError "Logtail running process count is abnormal, it should be 2"
        logSuggestion 'Try [/etc/init.d/ilogtaild stop] to stop logtail, and use [/etc/init.d/ilogtaild start] to start logtail.'
        RETVAL=2
        return $RETVAL
    else
        logOK "Logtail is runnings."
        RETVAL=0
        return $RETVAL
    fi
}

g_aliuidDir="/etc/ilogtail/users"

aliuids=()

function checkAliuid()
{
    logInfo "Check aliyun user id(s)"
    aliuids=(`ls $g_aliuidDir`)
    if [ ${#aliuids[@]} == 0 ] 
    then
        logInfo 'No aliyun user id found.'
        # logWarning "No aliyun user id."
        # logSuggestion 'If your config need aliuid, follow this link for more help: https://help.aliyun.com/document_detail/49007.html'
    fi
    for aliuid in ${aliuids[@]}
    do
        logOK "aliyun user id : " $aliuid '.'
    done
    echo
}

gUserDefinedIdFile="/etc/ilogtail/user_defined_id"
gUserDefinedIdDetail=""

if [ -f $gUserDefinedIdFile ]
then
    gUserDefinedIdDetail=`cat $gUserDefinedIdFile`
fi

function checkUserDefinedId()
{
    logInfo "Check user defined id"
    if [ -f $gUserDefinedIdFile ]
    then
        logOK 'User defined id is :' `cat $gUserDefinedIdFile` '.'
    else
        logInfo 'No user defined id found.'
        # logWarning 'No user defined id exist.'
        # logSuggestion 'If your config need user defined id, follow this link for more help: https://help.aliyun.com/document_detail/28983.html'
    fi    
}

gUserConfigFile="user_log_config.json"

function checkUserConfigFile()
{
    logInfo "Check user config file"
    if [ -f $gUserConfigFile ]
    then
        logOK 'User config file exists, configs :'
        grep "##" /usr/local/ilogtail/user_log_config.json | awk '{printf $1}'
        echo ""
        return 0
    else
        logWarning 'User config file doesnt exist.'
        logSuggestion 'Please check your logtail project/logstore config and make sure you have applied config to your machine group'
        echo
        return 1
    fi    
    echo
}


function checkSpecificLogFileStatus()
{
    if [ -L $1 ]
    then 
        logWarning 'Specific log file is a linked file'
        if [ -f $1 ]
        then
            logInfo 'Valid linked file'
        else
            logWarning 'Invalid linked file'
        fi
        return
    fi
    if [ -f $1 ]
    then
        logOK 'Specific log file exists.'
        # check file's update time
        logFileModifyTime=`stat -c %Y $1`
        nowTime=`date +%s`
        # echo $logFileModifyTime $nowTime
        deltaTime=`expr $nowTime - $logFileModifyTime`
        # echo $deltaTime
        if [ $deltaTime -gt '900' ]
        then
            logWarning 'Log file has not changed during last' $deltaTime 'seconds.'
        fi
        return 0
    else
        logWarning 'Specific log file doesnt exist.'
        return 1
    fi   
}

function checkSpecificLogFile()
{
    # Stop shell wildcard character expansion
    set -f
    logInfo 'Check specific log file'
    logInfo 'Check if specific log file [' $1 '] is included by user config.' 
    specificFilePath=$1
    checkSpecificLogFileStatus $specificFilePath
    if [ -f $gUserConfigFile ]
    then
        # find key words: file_pattern, log_path
        logfileNameAll=`awk -F'[",]' '/file_pattern/{printf $4","}' $gUserConfigFile 2>/dev/null`
        logfilePathAll=`awk -F'[",]' '/log_path/{printf $4","}' $gUserConfigFile 2>/dev/null`
        logstoreAll=`awk -F'[",]' '/category/{printf $4","}' $gUserConfigFile 2>/dev/null`
        logProjectAll=`awk -F'[",]' '/project_name/{printf $4","}' $gUserConfigFile 2>/dev/null`
        # split
        OLD_IFS="$IFS" 
        IFS="," 
        logfileNames=($logfileNameAll)
        logfilePaths=($logfilePathAll) 
        logstores=($logstoreAll)
        logProjects=($logProjectAll) 
        IFS="$OLD_IFS"

        if [ ${#logfileNames[*]} -ne ${#logfilePaths[*]} ]
        then
            logError 'User config file format error.'
            logSuggestion 'Make sure you have not modify' $gUserConfigFile 'manually'
            return 1
        fi

        specificFileName=${specificFilePath##*/}
        specificFileDir=${specificFilePath%/*}
        # echo $specificFileName $specificFileDir
        # check every config
        matchCount=0
        for((i=0;i<${#logfileNames[*]};i++));  
        do   
            # echo 'for' ${logfileNames[$i]} ${logfilePaths[$i]}
            tmpFileName=${logfileNames[$i]}
            tmpFilePath=${logfilePaths[$i]}
            tmpFilePath=${tmpFilePath%/}
            tmpFilePath=`expr $tmpFilePath'/*'`
            # echo $tmpFilePath

            if [[ "$specificFileDir" = $tmpFilePath  || "$specificFileDir" = ${tmpFilePath%/*} ]];then 
                #echo 'Dir matched.'
                if [[ "$specificFileName" = $tmpFileName ]];then 

                    logOK 'Matched config found:'
                    logInfo '[Project] ->' ${logProjects[$i]}
                    logInfo '[Logstore] ->' ${logstores[$i]}
                    logInfo '[LogPath] ->' ${logfilePaths[$i]}
                    logInfo '[FilePattern] ->' ${logfileNames[$i]}

                    matchCount=`expr $matchCount + 1`
                fi
            fi
        done  

        if [ $matchCount = 0 ] 
        then
            logError 'No match config for your log file.'
            logSuggestion 'Please check your logtail project/logstore config and make sure you have applied config to your machine group'
            logSuggestion 'For more about logtail config, follow this link for more help: https://help.aliyun.com/document_detail/49010.html'
        elif [ $matchCount -gt 1 ]
        then
            logWarning 'Multi(' $matchCount ') configs for your log file.'
            logSuggestion 'Please make sure every log file should only match one config. Logtail will choose a matched config randomly if the log file has multi configs.'
        fi
        
        # echo ${#logfileNames[*]} ${#logfilePaths[*]} $logfileNames $logfilePaths
    fi
    echo
    # Start shell wildcard character expansion
    set +f
}

gAppInfoFile="app_info.json"
logtailIpConfig=`awk -F'[",]' '/ip/{printf $4}' $gAppInfoFile 2>/dev/null`

function checkNetwork()
{
    logInfo "Check network status"
    # logInfo "Local address:"
    # LC_ALL=C ifconfig|grep "inet "
    logtailIpConfig=`awk -F'[",]' '/ip/{printf $4}' $gAppInfoFile 2>/dev/null`
    logtailUUIDConfig=`awk -F'[",]' '/UUID/{printf $4}' $gAppInfoFile 2>/dev/null`


    if [ $logtailIpConfig ]
    then
        logInfo 'Logtail is using ip: ' $logtailIpConfig
    else
        logWarning 'Can`t find ip address in ' $gAppInfoFile
        # logSuggestion 'Make sure your logtail is running.'
    fi


    if [ $logtailUUIDConfig ]
    then
        logInfo 'Logtail is using UUID: ' $logtailUUIDConfig
    else
        logWarning 'Can`t find UUID in ' $gAppInfoFile
        # logSuggestion 'Make sure your logtail is running.'
    fi

    # check port 443 status
    logInfo "Check SSL status"
    sslStatus=`sudo service iptables status | grep 'DROP ' | grep 'tcp dpt:443'`
    if [ $? -ne 0 ] 
    then
        logOK "SSL status OK."
    else
        logWarning "SSL port 443 may be closed, please check your firewall."
        logSuggestion 'You shold open 443 port for SSL.'
    fi

    # check is proxy configged
    proxyFlag=`grep -oP config.sls-proxy.aliyun-inc.com ilogtail_config.json`
    # echo proxyFlag  ${#proxyFlag[@]} $proxyFlag
    if [ $? -ne 0 ]
    then
        logInfo "Check logtail config server"
        # find config_server_address
        configServerLink=`grep -oP '"config_server_address"[\ ]*:[\ ]*"http://[0-9a-zA-Z\./=-]*.com"' ilogtail_config.json | grep -oP 'http://[0-9a-zA-Z\./=-]*.com'`
        logInfo "config server address: " $configServerLink 
        if [  $? == 0 ] 
        then
            if hash curl 2>/dev/null;then
                #echo curl --connect-timeout 10 -m 20 $configServerLink
                curl --connect-timeout 10 -m 20 $configServerLink > '/tmp/logtailchecktooltmp.tmp' 2>/dev/null
                sslResult=`grep 'curl' /tmp/logtailchecktooltmp.tmp`
                #echo $sslResult
                if [ $? == 0 ]
                then
                    logError "Config server invalid: " $configServerLink
                    logSuggestion "Check your network config."
                else
                    logOK "Logtail config server OK"
                fi
                rm '/tmp/logtailchecktooltmp.tmp'
            else
                logWarning "Logtail checking tool require [curl] but it's not installed."
            fi
        else
            logError "Logtail has no config server address."
            logSuggestion 'Make sure you have logtail installed, or try install logtail again.'
        fi
    else
        logWarning "Logtail use discard proxy config"
    fi
    echo
}

function checkProfileStatus()
{
    logInfo 'Last logtail log'
    tail -n 5 ilogtail.LOG
    echo
    
    if [ -f ilogtail_config.json ]
    then
        logOK 'Logtail config file : ilogtail_config.json exists.'
        cat ilogtail_config.json
    else
        logError 'Logtail config file : ilogtail_config.json doesnt exist.'
        logSuggestion 'Make sure you have logtail installed, or try install logtail again.'
        return
    fi  
    
    logInfo 'logtail info : '
    cat $gAppInfoFile 
    logInfo 'Check profile status'
    if [ -f snapshot/ilogtail_profile.LOG ]
    then
        logInfo 'ilogtail_profile.LOG'
        stat snapshot/ilogtail_profile.LOG | grep Modify
        return 0
    fi
    if [ -f logtail_profile_snapshot ]
    then
        logInfo 'logtail_profile_snapshot'
        stat logtail_profile_snapshot | grep Modify
        return 0
    fi
    return 1
}

function showVersion()
{
    logInfo 'Logtail checking tool version : '$gLogtailCheckingToolVersion
}

function printHelp()
{
    echo
    echo 'VERSION'
    echo '    Logtail checking tool version : '$gLogtailCheckingToolVersion
    echo 
    echo 'SYNOPSIS'
    echo '    checkingtool.sh [OPTION]'
    echo 
    echo 'DESCRIPTION'
    echo '    Check logtail environment.'
    
    echo 
    
    echo 'OPTIONS'
    echo '    --logFile <LogFilePath>   : check if specific log file <LogFilePath> is included by user config and logtail environment status.'
    echo '    --envOnly                 : only check logtail environment status.'
    echo '    --logFileOnly             : only check if specific log file <LogFilePath> is included by user config'
    echo
    echo 'RETURN'
    echo '    Error count checkingtool found.'
    echo 
    echo 
    echo 'For example:'
    
    echo '   use [./checkingtool --logFile /user/local/myapp/error.log] to check if the log file is included by your config and logtail environment status.'
    echo

    echo '  If all outputs are OK, please view aliyun log service documents for more help:'
    echo -e '   \033[4m\033[33mhttps://help.aliyun.com/document_detail/49911.html'
    echo -en '\033[0m'
}


function resultStatistics()
{
    echo 'Check complete.'

    if [ $gErrorCount == 0 ] 
    then
        if [ $gWarningCount == 0 ] 
        then
            echo -e '\033[32m' && echo ' All checking items are [ OK ]. '
            echo -en '\033[0m'
        else
            echo -e '\033[33m' && echo ' [ ' $gWarningCount ' ] warning(s) found.'
            echo -en '\033[0m'
        fi

        echo '  If your log collection is abnormal all the same, please view aliyun log service documents for more help:'
        echo -e ' \033[4m\033[33mhttps://help.aliyun.com/document_detail/49911.html'
        echo -en '\033[0m' 
    else
        echo -e '\033[33m' && echo ' [ ' $gWarningCount ' ] warning(s) found.'
        echo -en '\033[0m'
        echo -e '\033[31m' && echo ' [ ' $gErrorCount ' ] error(s) found.'
        echo -en '\033[0m'
    fi 

    
    echo  
}

function continueOrNot()
{
    if [ $gErrorCount == 0 ]
    then
        if [ $gWarningCount -gt 0 ]
        then
            logInput "Last check item shows a warning, do you want to continue? (Y/n)"
        else
            return
        fi
    else
        logInput "Last check item shows an error, do you want to continue? (Y/n)"
    fi
    gWarningCount=0
    gErrorCount=0
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "" || $inp == "y" ]]
    then 
        return
    else
        exit 1
    fi

}

showVersion

function checkAll()
{
    checkSystemSupport
    checkInstallFiles
    checkLogtailStatus
    checkAliuid
    checkUserDefinedId
    checkUserConfigFile
    checkNetwork
    checkProfileStatus
    resultStatistics
}

MAKESURE_ECS="Is your server non-Alibaba Cloud ECS or not belong to the same account with the current Project of Log Service ?  (y/N) "
MAKESURE_ALIUID="Is your project owner account ID is the above IDs ? (y/N) "
MAKESURE_ECS_SUGGETION="please configure user IDs (account IDs), this doc will help [ https://www.alibabacloud.com/help/doc-detail/49007.htm ]"

function makesureECS()
{
    logInput $MAKESURE_ECS
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "y" ]]
    then 
        checkAliuid

        if [ ${#aliuids[@]} == 0 ]
        then
            logErrorEnd $MAKESURE_ECS_SUGGETION
        else
            logInput $MAKESURE_ALIUID
            read inp
            inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
            if [[ $inp == "y" ]]
            then 
                return
            else 
                logErrorEnd $MAKESURE_ECS_SUGGETION
            fi
        fi

    else
        return
    fi
}


MAKESURE_REGION="please make sure your project is in this region : {"
MAKESURE_REGION_SUGGETION="please reinstall your logtail or recreate your project to make sure your project is located in the same region with your Logtail"

function makesureRegion()
{
    region=`cat ilogtail_config.json | grep "cluster" | awk -F'[",]' '{ print $4; }'`
    logInput $MAKESURE_REGION $region "}  (y/N) : "
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "y" ]]
    then 
        return
    else
        logErrorEnd $MAKESURE_REGION_SUGGETION
        exit 1
    fi

}

MAKESURE_IP="please make sure your machine group's ip is same with : {"
MAKESURE_USER_DEFINED_ID=" or your machine group's userdefined-id is in : {"
MAKESURE_IP_SUGGETION="please correct your machine group's ip or userdefined-id, save the configuration, wait 1 minute and check again"

function makesureIP()
{
    logInput $MAKESURE_IP $logtailIpConfig "} " $MAKESURE_USER_DEFINED_ID  $gUserDefinedIdDetail "} (y/N) : "
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "y" ]]
    then 
        return
    else
        logErrorEnd $MAKESURE_IP_SUGGETION
        exit 1
    fi
}

MAKESURE_HEARTBEAT_OK="please make sure your machine's heartbeat is ok and machine group's ip is same with : {"
MAKESURE_HEARTBEAT_SUGGETION="please follow step 1 to check machine group's heartbeat"

function makesureMachineGroupHeartBeat()
{
    logInput $MAKESURE_HEARTBEAT_OK $logtailIpConfig "} (y/N) : "
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "y" ]]
    then 
        return
    else
        logErrorEnd $MAKESURE_HEARTBEAT_SUGGETION
        exit 1
    fi
}

MAKESURE_CONFIG_APPLIED="please make sure you have applied collection config to the machine group"
MAKESURE_CONFIG_APPLIED_SUGGETION="please apply collection config to the machine group"

function makesureConfigApplied()
{
    logInput $MAKESURE_CONFIG_APPLIED " (y/N) : "
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "y" ]]
    then 
        return
    else
        logErrorEnd $MAKESURE_CONFIG_APPLIED_SUGGETION
        exit 1
    fi
}


MAKESURE_ALL_CORRECT="please make sure all the check items above have passed. If the problem persists, please copy all the outputs and submit a ticket in the ticket system. : (y/N) "
MAKESURE_ALL_CORRECT_SUGGETION="Please copy all the outputs and submit a ticket in the ticket system. we will look into the problem."

function checkMachineGroupHeartBeat()
{
    checkInstallFiles
    continueOrNot
    checkLogtailStatus
    continueOrNot
    checkNetwork
    continueOrNot
    makesureECS
    makesureRegion
    makesureIP

    logInput $MAKESURE_ALL_CORRECT
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "y" ]]
    then 
        checkAll
        logErrorEnd $MAKESURE_ALL_CORRECT_SUGGETION
    else
        exit 1
    fi
}


INPUT_LOG_FILE_PATH="please input your log file's full path (eg. /var/log/nginx/access.log) : "
function checkLogFile()
{
    makesureMachineGroupHeartBeat
    makesureConfigApplied

    logInput $INPUT_LOG_FILE_PATH
    read logPath
    checkSpecificLogFile $logPath
    continueOrNot

    logInput $MAKESURE_ALL_CORRECT
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    if [[ $inp == "y" ]]
    then 
        checkAll
        logErrorEnd $MAKESURE_ALL_CORRECT_SUGGETION
    else
        exit 1
    fi

}

CHOOSE_CHECK_TYPE="please choose which item you want to check : \n\t\t1. MachineGroup heartbeat fail. \n\t\t2. MachineGroup heartbeat is ok, but log files have not been collected. \n\tItem :  "
function interactiveCheck()
{

    logInput $CHOOSE_CHECK_TYPE
    read inp
    inp=`echo "$inp" | tr '[:upper:]' '[:lower:]'`
    case $inp in
    1)
        checkMachineGroupHeartBeat
    ;;
    2)
        checkLogFile
    ;;
    *)
        logWarning "Unknow input. "
        echo 
        exit 1
    esac


}

if [ $# == 0 ]
then
    interactiveCheck
else
    case "$1" in
    --logFile)
    if [ $# -ne 2 ] 
    then
        logWarning '[logFile] needs log file name with full path.'
        logSuggestion "Try " "[./checkingtool.sh --help]" " for more information. "
        exit 1
    else
        checkSpecificLogFile $2
        checkAll
    fi
    ;;
    --envOnly)
    checkAll
    ;;
    --logFileOnly)
    if [ $# -ne 2 ]
    then
        logWarning '[logFile] needs log file name with full path.'
        logSuggestion "Try " "[./checkingtool.sh --help]" " for more information. "
        exit 1
    else
        checkSpecificLogFile $2
        resultStatistics
    fi
    ;;
    --help)
    printHelp
    ;;
    *)
    logWarning "Unknow param, try " "[--help]" " for more information. "
    echo 
    ;;
    esac
fi


exit $gErrorCount
