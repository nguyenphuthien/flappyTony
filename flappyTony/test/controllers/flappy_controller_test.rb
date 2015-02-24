require 'test_helper'

class FlappyControllerTest < ActionController::TestCase
  test "should get bird" do
    get :bird
    assert_response :success
  end

end
