Add-Type -AssemblyName System.speech | Out-Null
$spk = new-object System.Speech.Synthesis.SpeechSynthesizer
# $voices = $spk.GetInstalledVoices().voiceinfo
# Write-Output $voices
# foreach($voice in $voices){$spk.SelectVoice($voice.Name);$spk.Speak($voice.name)}

$spk.SelectVoice("Microsoft Eva Mobile") # cortana

$myTxtFiles = @(
  '00-AdoptingInnerSource.txt'
  '01-AdoptingInnerSource.txt'
  '02-AdoptingInnerSource.txt'
  '03-AdoptingInnerSource.txt'
  '04-AdoptingInnerSource.txt'
  '05-AdoptingInnerSource.txt'
  '06-AdoptingInnerSource.txt'
  '07-AdoptingInnerSource.txt'
  '08-AdoptingInnerSource.txt'
  '09-AdoptingInnerSource.txt'
)

foreach($txtFile in $myTxtFiles) {
  $outPutFile = $txtFile -replace ".txt"
  $spk.SetOutputToWaveFile("./AdoptingInnerSource/" + $outPutFile + ".wav")
  $myMessage = Get-Content -Path ("./" + $txtFile)
  $spk.Speak($myMessage)
}
