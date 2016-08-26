Vagrant.configure("2") do |config|

  config.vm.box = 'hashicorp/precise64'
  config.vm.hostname = 'wikiwash-dev-box'

  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.provision :shell, path: 'bootstrap.sh'

  config.vm.synced_folder '.', '/vagrant'

  config.vm.provider 'virtualbox' do |v|
      v.memory = 1024
      v.cpus = 2
    end
end
